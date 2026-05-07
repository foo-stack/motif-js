import {
  buildAtRulesCss,
  buildPseudoCss,
  hashAtRules,
  hashPseudoRules,
  type AtRule,
  type PseudoRule,
} from '@motif-js/core';

export type { AtRule, PseudoRule };

interface StyleCacheState {
  /** Class names that have already been injected. */
  readonly injected: Set<string>;
  /** Pending CSS for environments where neither a document nor an SSR collector is available. */
  readonly pendingCss: string[];
  /** The injected `<style>` element, lazily created. */
  styleEl: HTMLStyleElement | null;
  /** Whether we've already scanned the DOM for SSR-injected styles. */
  hydrated: boolean;
}

const cache: StyleCacheState = {
  injected: new Set<string>(),
  pendingCss: [],
  styleEl: null,
  hydrated: false,
};

/**
 * Per-request collector for server-side rendering. The renderer routes
 * injected CSS to whichever collector is currently active rather than
 * trying to touch a (non-existent) `document`.
 *
 * Usage:
 *
 * ```ts
 * import { renderToString } from 'react-dom/server';
 * import { SSRStyleCollector } from '@motif-js/react-web';
 *
 * const collector = new SSRStyleCollector();
 * const html = collector.collect(() => renderToString(<App />));
 * const styleTag = collector.getStyleTag();
 * // Embed `styleTag` in <head> alongside `html` in the response.
 * ```
 *
 * **Concurrency:** by default the active-collector pointer is
 * module-level — safe for synchronous `renderToString` calls. Streaming
 * SSR (`renderToReadableStream`) and React Server Components both
 * interleave async work across requests, which corrupts a module-level
 * pointer. To make collection async-safe, import
 * `@motif-js/react-web/server` once at app startup; that module
 * registers an `AsyncLocalStorage`-backed storage backend.
 */
export class SSRStyleCollector {
  private readonly rules: string[] = [];
  private readonly localInjected = new Set<string>();

  /**
   * Run `fn` with this collector active. CSS produced by motif components
   * during the call is captured here instead of injected into the
   * document. The previous active collector (if any) is restored on exit.
   */
  collect<T>(fn: () => T): T {
    return storage.run(this, fn);
  }

  /** Raw CSS captured during this collector's `collect()` call. */
  getCss(): string {
    return this.rules.join('\n');
  }

  /**
   * The captured CSS wrapped in a `<style data-motif-ssr>` tag, ready to
   * embed in the rendered HTML's `<head>`. Returns an empty string if
   * nothing was collected.
   *
   * The `data-motif-ssr` marker is read on the client to seed the
   * style-cache's injected set so the same rules aren't injected twice
   * after hydration.
   */
  getStyleTag(): string {
    if (this.rules.length === 0) return '';
    return `<style data-motif-ssr>${this.rules.join('\n')}</style>`;
  }

  /** Internal: append a rule to this collector. */
  _append(className: string, css: string): void {
    if (this.localInjected.has(className)) return;
    this.localInjected.add(className);
    this.rules.push(css);
  }

  /**
   * Internal: drain the captured CSS without resetting the dedup set.
   * Used by streaming SSR registries that emit a `<style>` block per
   * suspense flush — the next flush should only include rules added
   * since the last drain. Leaving `localInjected` populated prevents
   * the same rule from being re-emitted across flushes.
   */
  _drain(): void {
    this.rules.length = 0;
  }
}

/**
 * Pluggable backend for tracking the currently-active collector. The
 * default {@link syncCollectorStorage} uses a module-level pointer (safe
 * for sync `renderToString`); the server-only entry registers an
 * `AsyncLocalStorage`-backed variant for streaming SSR / RSC.
 */
export interface CollectorStorage {
  get(): SSRStyleCollector | null;
  run<T>(collector: SSRStyleCollector, fn: () => T): T;
}

/** Sync (module-level) storage. Default. */
export const syncCollectorStorage: CollectorStorage = (() => {
  let active: SSRStyleCollector | null = null;
  return {
    get: () => active,
    run<T>(c: SSRStyleCollector, fn: () => T): T {
      const prev = active;
      active = c;
      try {
        return fn();
      } finally {
        active = prev;
      }
    },
  };
})();

let storage: CollectorStorage = syncCollectorStorage;

/**
 * Swap the storage backend used to track the active collector. Intended
 * to be called once at app startup by `@motif-js/react-web/server` to
 * install the `AsyncLocalStorage`-backed backend. Idempotent.
 */
export function setCollectorStorage(impl: CollectorStorage): void {
  storage = impl;
}

/**
 * Read SSR-injected `<style data-motif-ssr>` blocks out of the document
 * and seed the cache's injected set with the class names found inside,
 * so client-side renders don't re-inject the same rules.
 *
 * Idempotent — runs at most once per page load. No-op outside the browser.
 */
function hydrateFromSSR(): void {
  if (cache.hydrated) return;
  cache.hydrated = true;
  if (typeof document === 'undefined') return;
  const ssrEls = document.querySelectorAll('style[data-motif-ssr]');
  const classRe = /\.(m-[a-z0-9]+)/g;
  // @keyframes rules don't carry a `.<class>` selector, so a separate
  // pass picks up their name from `@keyframes m-anim-<hash>` so the
  // client dedup matches what SSR already emitted.
  const keyframeRe = /@keyframes\s+(m-anim-[a-z0-9]+)/g;
  for (const el of ssrEls) {
    const css = el.textContent ?? '';
    for (const match of css.matchAll(classRe)) {
      cache.injected.add(match[1]!);
    }
    for (const match of css.matchAll(keyframeRe)) {
      cache.injected.add(match[1]!);
    }
  }
}

function emitToBrowser(css: string): void {
  if (cache.styleEl !== null) {
    cache.styleEl.appendChild(document.createTextNode(`\n${css}`));
    return;
  }
  if (typeof document === 'undefined') {
    cache.pendingCss.push(css);
    return;
  }
  cache.styleEl = document.createElement('style');
  cache.styleEl.setAttribute('data-motif-style-cache', '');
  cache.styleEl.appendChild(document.createTextNode(css));
  document.head.appendChild(cache.styleEl);
}

/**
 * Generate a deterministic class name for a set of at-rules and inject the
 * corresponding CSS into the document (deduplicated by class name).
 *
 * Returns the class name, or `undefined` if there are no rules to inject.
 *
 * Safe to call from render. On the server it routes to the active
 * `SSRStyleCollector`; on the client it appends to a singleton
 * `<style data-motif-style-cache>` element. SSR-emitted classes (carried
 * over via `<style data-motif-ssr>`) are picked up on first call to
 * prevent double-injection after hydration.
 */
export function injectAtRules(
  rules: readonly AtRule[],
  override?: SSRStyleCollector | null,
): string | undefined {
  if (rules.length === 0) return undefined;

  const className = hashAtRules(rules);
  const css = buildAtRulesCss(className, rules);

  // Server path: route to the active per-request collector. Each collector
  // dedupes locally so concurrent requests don't shadow each other's CSS.
  // The `override` (typically from `useActiveCollector()`) wins over the
  // module-level storage so React-context-driven setups (App Router) and
  // call-site setups (renderToString) compose cleanly.
  const collector = override ?? storage.get();
  if (collector !== null) {
    collector._append(className, css);
    return className;
  }

  // Browser path: dedup against the module-level set, emit to <style>.
  hydrateFromSSR();
  if (cache.injected.has(className)) return className;
  cache.injected.add(className);
  emitToBrowser(css);
  return className;
}

/**
 * Generate a deterministic class name for a set of pseudo-state rules and
 * inject them. Mirrors {@link injectAtRules} but emits selector-suffixed
 * rules (`:hover`, `:focus-visible`, etc.) rather than at-rule blocks.
 *
 * Returns the class name, or `undefined` if there are no rules to inject.
 */
export function injectPseudoRules(
  rules: readonly PseudoRule[],
  override?: SSRStyleCollector | null,
): string | undefined {
  if (rules.length === 0) return undefined;

  const className = hashPseudoRules(rules);
  const css = buildPseudoCss(className, rules);

  const collector = override ?? storage.get();
  if (collector !== null) {
    collector._append(className, css);
    return className;
  }

  hydrateFromSSR();
  if (cache.injected.has(className)) return className;
  cache.injected.add(className);
  emitToBrowser(css);
  return className;
}

/**
 * Register an `@keyframes` block. Idempotent per `name` — calling with
 * the same `name` more than once is a no-op (assumes the body matches;
 * the runtime trusts the caller, since `keyframes(...)` returns a
 * stable hash-based name derived from the body).
 *
 * On the server: routes to the active `SSRStyleCollector`. Each
 * collector dedupes locally so concurrent requests don't shadow each
 * other's `@keyframes`. On the client: appends to the singleton
 * `<style data-motif-style-cache>` element. SSR-emitted `@keyframes`
 * (carried over via `<style data-motif-ssr>`) are picked up on first
 * call to prevent double-injection after hydration.
 */
export function injectKeyframes(
  name: string,
  css: string,
  override?: SSRStyleCollector | null,
): void {
  const collector = override ?? storage.get();
  if (collector !== null) {
    collector._append(name, css);
    return;
  }
  hydrateFromSSR();
  if (cache.injected.has(name)) return;
  cache.injected.add(name);
  emitToBrowser(css);
}

/**
 * Flush any CSS queued in environments without a document and without an
 * active `SSRStyleCollector`. Should be unused in normal SSR flows — the
 * collector is the supported path. Returns the queued CSS and clears the
 * queue.
 */
export function flushPendingCss(): string {
  const out = cache.pendingCss.join('\n');
  cache.pendingCss.length = 0;
  return out;
}

/** Test-only: reset the cache and the storage backend. */
export function _resetStyleCacheForTesting(): void {
  cache.injected.clear();
  cache.pendingCss.length = 0;
  cache.styleEl = null;
  cache.hydrated = false;
  storage = syncCollectorStorage;
}

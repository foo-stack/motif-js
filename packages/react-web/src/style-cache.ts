import type { ResolvedStyle } from '@motif-js/core';

/**
 * Tiny, fast, deterministic string hash. ~32 bits of entropy, base-36
 * encoded. Sufficient to generate stable class names from the serialised
 * representation of a responsive rule set.
 *
 * Not cryptographic — collision rate is negligible for this use case
 * (a few hundred-to-thousand unique class names per app).
 */
function hashString(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

/**
 * Convert a single CSS-shaped object into a declaration string.
 *
 * `padding` becomes `padding`; `paddingLeft` becomes `padding-left`. Number
 * values for length-like properties get a `px` suffix to match React's
 * inline-style behaviour, since we're emitting raw CSS rather than going
 * through the React `style` prop.
 */
function stringifyDeclarations(style: ResolvedStyle): string {
  const out: string[] = [];
  for (const key in style) {
    const value = style[key];
    const cssProp = camelToKebab(key);
    const cssValue = typeof value === 'number' ? maybePx(key, value) : value;
    out.push(`${cssProp}: ${cssValue};`);
  }
  return out.join(' ');
}

function camelToKebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

const UNITLESS_PROPS: ReadonlySet<string> = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flexGrow',
  'flexShrink',
  'order',
]);

function maybePx(prop: string, n: number): string {
  if (UNITLESS_PROPS.has(prop)) return String(n);
  return `${n}px`;
}

/**
 * A single class-scoped CSS rule wrapped in an at-rule (e.g. `@media`,
 * `@container`). The renderer hashes the full rule list to derive a stable
 * class name and injects each rule under that class.
 */
export interface AtRule {
  readonly atRule: string;
  readonly style: ResolvedStyle;
}

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
 * **Concurrency:** the active-collector pointer is module-level. That's
 * safe for synchronous `renderToString` (Node JS runs sync code without
 * preemption) but not for streaming SSR with concurrent renders. A
 * `AsyncLocalStorage`-backed variant for streaming is a future addition.
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
    const prev = pushActiveCollector(this);
    try {
      return fn();
    } finally {
      setActiveCollector(prev);
    }
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
}

let activeCollector: SSRStyleCollector | null = null;

function pushActiveCollector(c: SSRStyleCollector): SSRStyleCollector | null {
  const prev = activeCollector;
  activeCollector = c;
  return prev;
}

function setActiveCollector(c: SSRStyleCollector | null): void {
  activeCollector = c;
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
  for (const el of ssrEls) {
    const css = el.textContent ?? '';
    for (const match of css.matchAll(classRe)) {
      cache.injected.add(match[1]!);
    }
  }
}

/**
 * Build the CSS rule string for a list of at-rules under a class name.
 *
 * @example
 *   buildRule('m-abc', [{ atRule: '@media (min-width: 768px)', style: { padding: 'var(--space-4)' } }])
 *   // → '@media (min-width: 768px) { .m-abc { padding: var(--space-4); } }'
 */
function buildRule(className: string, rules: readonly AtRule[]): string {
  return rules
    .map((r) => `${r.atRule} { .${className} { ${stringifyDeclarations(r.style)} } }`)
    .join('\n');
}

function emit(className: string, css: string): void {
  if (activeCollector !== null) {
    activeCollector._append(className, css);
    return;
  }
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
export function injectAtRules(rules: readonly AtRule[]): string | undefined {
  if (rules.length === 0) return undefined;
  hydrateFromSSR();

  // Deterministic key: serialise rules in their natural order. The
  // resolver guarantees stable ordering already (media → anon → named).
  const serialised = rules.map((r) => `${r.atRule}|${stringifyDeclarations(r.style)}`).join('||');
  const className = `m-${hashString(serialised)}`;

  if (cache.injected.has(className)) return className;
  cache.injected.add(className);

  emit(className, buildRule(className, rules));
  return className;
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

/** Test-only: reset the cache. */
export function _resetStyleCacheForTesting(): void {
  cache.injected.clear();
  cache.pendingCss.length = 0;
  cache.styleEl = null;
  cache.hydrated = false;
  activeCollector = null;
}

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

export interface MediaRule {
  readonly media: string;
  readonly style: ResolvedStyle;
}

interface StyleCacheState {
  /** Class names that have already been injected. */
  readonly injected: Set<string>;
  /** Pending CSS for SSR collection — rules emitted before `document` was available. */
  readonly pendingCss: string[];
  /** The injected `<style>` element, lazily created. */
  styleEl: HTMLStyleElement | null;
}

const cache: StyleCacheState = {
  injected: new Set<string>(),
  pendingCss: [],
  styleEl: null,
};

/**
 * Build the CSS rule string for a list of media rules under a class name.
 *
 * @example
 *   buildRule('m-abc', [{ media: '@media (min-width: 768px)', style: { padding: 'var(--space-4)' } }])
 *   // → '@media (min-width: 768px) { .m-abc { padding: var(--space-4); } }'
 */
function buildRule(className: string, rules: readonly MediaRule[]): string {
  return rules
    .map((r) => `${r.media} { .${className} { ${stringifyDeclarations(r.style)} } }`)
    .join('\n');
}

function appendToStyleEl(css: string): void {
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
 * Generate a deterministic class name for a set of media rules and inject
 * the corresponding CSS rule into the document (deduplicated by class name).
 *
 * Returns the class name, or `undefined` if there are no rules to inject.
 *
 * Safe to call from render — server-side renders queue rules into
 * `pendingCss` for later flushing (Phase B SSR work).
 */
export function injectMediaRules(rules: readonly MediaRule[]): string | undefined {
  if (rules.length === 0) return undefined;

  // Deterministic key: serialise rules in their natural order. The
  // resolver guarantees mobile-first ordering already.
  const serialised = rules.map((r) => `${r.media}|${stringifyDeclarations(r.style)}`).join('||');
  const className = `m-${hashString(serialised)}`;

  if (cache.injected.has(className)) return className;
  cache.injected.add(className);

  appendToStyleEl(buildRule(className, rules));
  return className;
}

/**
 * Flush queued (server-side) CSS rules. Used by SSR collectors to dump
 * accumulated rules into the rendered HTML before hydration. (Stub for
 * future SSR work — currently just exposes the queue.)
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
}

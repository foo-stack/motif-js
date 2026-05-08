import type { AtRule } from './style.js';
import type { ResolvedStyle } from './types.js';

/**
 * Shared CSS-emission helpers used by both the web runtime
 * (`@motif-js/react-web`) and the compiler (`@motif-js/compiler-core`).
 *
 * The compiler must emit byte-identical class names and CSS bodies to the
 * runtime so that runtime-rendered and compile-extracted output collide
 * (deduplicate) on the same class. Keeping the helpers here is the
 * single-source-of-truth that prevents drift.
 */

const UNITLESS_PROPS: ReadonlySet<string> = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flexGrow',
  'flexShrink',
  'order',
]);

/**
 * Tiny, fast, deterministic string hash. ~32 bits of entropy, base-36
 * encoded. Sufficient to generate stable class names from the serialised
 * representation of a rule set. Not cryptographic.
 */
export function hashString(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

export function camelToKebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * `padding: 8` → `8px`. Unitless properties (opacity, zIndex, etc.) keep
 * the bare number. Mirrors React's inline-style auto-pixel rule so the
 * runtime's `style={...}` path and the compiler's emitted CSS agree.
 */
export function maybePx(prop: string, n: number): string {
  if (UNITLESS_PROPS.has(prop)) return String(n);
  return `${n}px`;
}

/**
 * Convert a single CSS-shaped object into a declaration string.
 *
 * `padding` becomes `padding`; `paddingLeft` becomes `padding-left`. Number
 * values for length-like properties get a `px` suffix.
 */
export function stringifyDeclarations(style: ResolvedStyle): string {
  const out: string[] = [];
  for (const key in style) {
    const value = style[key];
    const cssProp = camelToKebab(key);
    const cssValue = typeof value === 'number' ? maybePx(key, value) : value;
    out.push(`${cssProp}: ${cssValue};`);
  }
  return out.join(' ');
}

/**
 * A class-scoped CSS rule for a pseudo-state (`:hover`, `:focus-visible`,
 * etc.). `&` inside the suffix is replaced with the class selector to
 * support selector lists like `':disabled, &[aria-disabled="true"]'`.
 */
export interface PseudoRule {
  readonly pseudo: string;
  readonly style: ResolvedStyle;
}

/**
 * Build the CSS body for a list of at-rules under a class name.
 *
 * An entry with `atRule === ''` is the **base class block**: emitted as a
 * bare class selector with no at-rule wrapper. Used by the responsive
 * resolver to keep `base` values at the same specificity as their
 * media/container overrides.
 *
 * @example
 *   buildAtRulesCss('m-abc', [{ atRule: '@media (min-width: 768px)', style: { padding: 'var(--space-4)' } }])
 *   // → '@media (min-width: 768px) { .m-abc { padding: var(--space-4); } }'
 */
export function buildAtRulesCss(className: string, rules: readonly AtRule[]): string {
  return rules
    .map((r) =>
      r.atRule === ''
        ? `.${className} { ${stringifyDeclarations(r.style)} }`
        : `${r.atRule} { .${className} { ${stringifyDeclarations(r.style)} } }`,
    )
    .join('\n');
}

/**
 * Build the CSS body for a list of pseudo-state rules under a class name.
 *
 * @example
 *   buildPseudoCss('m-abc', [{ pseudo: ':hover', style: { opacity: 0.8 } }])
 *   // → '.m-abc:hover { opacity: 0.8; }'
 */
export function buildPseudoCss(className: string, rules: readonly PseudoRule[]): string {
  return rules
    .map((r) => {
      const selector = r.pseudo.includes('&')
        ? r.pseudo.replace(/&/g, `.${className}`)
        : `.${className}${r.pseudo}`;
      return `${selector} { ${stringifyDeclarations(r.style)} }`;
    })
    .join('\n');
}

/**
 * Hash a list of at-rules into a deterministic class name (`m-<hash>`).
 * Serialisation order is preserved (the resolver guarantees stable
 * media → anon-container → named-container ordering).
 */
export function hashAtRules(rules: readonly AtRule[]): string {
  const serialised = rules.map((r) => `${r.atRule}|${stringifyDeclarations(r.style)}`).join('||');
  return `m-${hashString(serialised)}`;
}

/** Hash a list of pseudo rules into a deterministic class name. */
export function hashPseudoRules(rules: readonly PseudoRule[]): string {
  const serialised = rules.map((r) => `${r.pseudo}|${stringifyDeclarations(r.style)}`).join('||');
  return `m-${hashString(serialised)}`;
}

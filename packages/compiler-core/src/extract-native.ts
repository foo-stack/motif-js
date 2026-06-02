import { parseResponsiveDSL, resolveStyles } from '@usemotif/core';
import type { CallSiteAnalysis, NativeExtractionResult } from './types.js';

/**
 * Compile-time native extraction.
 *
 * Native renders against a JS-context theme rather than CSS variables, so
 * the resolver path is `resolveStyles(propsBag, theme)` — which needs a
 * theme. The compiler doesn't have a theme at build time, so we extract
 * **literal-only** native style entries: numbers, plain strings, and the
 * `base` slot of responsive values whose `base` itself is a literal
 * (non-token).
 *
 * Token references and responsive overrides stay at runtime. This is
 * deliberate: theming is dynamic on native (viewport-driven, JS-context),
 * and the cost of handing the theme to the compiler outweighs the win
 * from extracting more.
 *
 * Motion props (`enterStyle`, `exitStyle`, `transition`, `animation`,
 * `animateOnly`) intentionally pass through untouched. Native has no
 * StyleSheet equivalent for any of these — the entry / exit lifecycle is
 * driven by the registered animation driver (Reanimated, etc.) at
 * runtime, not by static styles. Recognising them in the analyzer keeps
 * dynamic-vs-static classification correct without extracting on this
 * side.
 *
 * The output is one flat style object; the Babel/Metro plugin shim is
 * responsible for hoisting these into a single `StyleSheet.create({...})`
 * per file and rewriting the JSX element to consume the resulting id.
 */
export function extractNative(analysis: CallSiteAnalysis): NativeExtractionResult {
  if (analysis.classification === 'dynamic' || analysis.staticProps.length === 0) {
    return { style: {}, consumedProps: [] };
  }

  const literalBag: Record<string, unknown> = {};
  const consumed: string[] = [];

  for (const p of analysis.staticProps) {
    const literal = asUnconditionalLiteral(p.value);
    if (literal === undefined) continue;
    if (typeof literal === 'string' && literal.startsWith('$')) continue;
    literalBag[p.name] = literal;
    if (p.sourceName === null) continue;
    consumed.push(p.sourceName ?? p.name);
  }

  if (Object.keys(literalBag).length === 0) {
    return { style: {}, consumedProps: [] };
  }

  // No theme — only literal values pass through. resolveStyles drops
  // unresolved token refs anyway, so passing `undefined` is safe.
  const { style } = resolveStyles(literalBag, undefined);
  return { style, consumedProps: consumed };
}

/**
 * Compile-time native extraction can only safely lower a prop whose value
 * is an *unconditional* literal — a bare number, or a plain string that is
 * not the responsive DSL.
 *
 * A responsive value (object, array, or DSL string) resolves against the
 * live viewport width at runtime, so it must be left on the JSX untouched.
 * Extracting only its `base` and consuming the prop — which is what this
 * function used to do — pins the element to `base` at every breakpoint and
 * silently drops every override (`{ base: 8, md: 16 }` would render `8`
 * even at `md`). Leaving the whole prop in place lets the native runtime
 * resolve it correctly, with nothing extracted to the StyleSheet so there
 * is no double application.
 *
 * Returns `undefined` to signal "not an unconditional literal — skip, and
 * leave the prop for the runtime resolver".
 */
function asUnconditionalLiteral(value: unknown): string | number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // A string that parses as the responsive DSL (`'base:8 md:16'`) is
    // conditional; only a plain literal string passes through.
    if (parseResponsiveDSL(value) !== null) return undefined;
    return value;
  }
  // Responsive object / array forms are always conditional here.
  return undefined;
}

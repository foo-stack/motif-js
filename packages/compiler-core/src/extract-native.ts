import {
  isResponsiveObject,
  parseResponsiveDSL,
  resolveStyles,
  responsiveArrayToObject,
} from '@motif-js/core';
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
    const reduced = reduceToLiteralBaseValue(p.value);
    if (reduced === undefined) continue;
    if (typeof reduced === 'string' && reduced.startsWith('$')) continue;
    literalBag[p.name] = reduced;
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
 * For native extraction, only the unconditional value matters at compile
 * time: a literal string/number, or the `base` slot of a responsive value
 * if and only if `base` itself is a literal.
 *
 * Returns `undefined` to signal "skip — leave on JSX so the runtime
 * resolves at viewport/container time".
 */
function reduceToLiteralBaseValue(value: unknown): unknown {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const dsl = parseResponsiveDSL(value);
    if (dsl !== null) {
      const base = dsl['base'];
      if (typeof base === 'number' || typeof base === 'string') return base;
      return undefined;
    }
    return value;
  }
  if (Array.isArray(value)) {
    const obj = responsiveArrayToObject(value);
    const base = obj['base'];
    if (typeof base === 'number' || typeof base === 'string') return base;
    return undefined;
  }
  if (isResponsiveObject(value)) {
    const base = (value as Record<string, unknown>)['base'];
    if (typeof base === 'number' || typeof base === 'string') return base;
    return undefined;
  }
  return undefined;
}

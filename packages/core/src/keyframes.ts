import { tokenRefToCssVar } from './css-vars.js';
import { hashString, stringifyDeclarations } from './css-emit.js';
import { isTokenRef } from './token.js';
import { keyframeBrand, type Keyframe } from './style-props.js';
import type { ResolvedStyle } from './types.js';

/**
 * One step in a `@keyframes` definition. Keys are percentage stops
 * (`'0%'`, `'50%'`, `'100%'`) or the keywords `'from'` / `'to'`. Values
 * are CSS-shaped style objects — token references (`'$colors.fg.base'`)
 * are accepted and emit `var(--…)`.
 */
export type KeyframeDef = {
  readonly [stop: string]: ResolvedStyle;
};

/**
 * Render a `@keyframes` block from its definition.
 *
 * Returns `{ name, css }`:
 *
 *   - `name` — stable identifier (`m-anim-<hash>`) derived from the
 *     serialized body, so identical definitions produce identical
 *     names regardless of where they're registered.
 *   - `css` — the full `@keyframes <name> { ... }` block ready to
 *     inject into a `<style>` element.
 *
 * Token references inside step values resolve to `var(--…)` so theme
 * switches flip animation colors through the cascade. Numeric length
 * values get the `px` suffix (mirroring React's inline-style auto-px).
 */
export function keyframesToCss(def: KeyframeDef): { readonly name: string; readonly css: string } {
  const body = renderKeyframeBody(def);
  const name = `m-anim-${hashString(body)}`;
  const css = `@keyframes ${name} { ${body} }`;
  return { name, css };
}

/**
 * Brand-aware constructor — used by the web renderer's `keyframes()`
 * to produce a {@link Keyframe} that the runtime can recognise as a
 * registered animation. The brand symbol is the only difference from
 * the bare `keyframesToCss` shape.
 */
export function makeKeyframe(def: KeyframeDef): Keyframe {
  const { name, css } = keyframesToCss(def);
  return { name, css, [keyframeBrand]: true };
}

function renderKeyframeBody(def: KeyframeDef): string {
  const parts: string[] = [];
  for (const stop in def) {
    const stepStyle = def[stop];
    if (stepStyle === undefined) continue;
    const resolved: ResolvedStyle = {};
    for (const key in stepStyle) {
      const value = stepStyle[key];
      if (typeof value === 'string' && isTokenRef(value)) {
        const v = tokenRefToCssVar(value);
        if (v !== undefined) resolved[key] = v;
      } else if (typeof value === 'string' || typeof value === 'number') {
        resolved[key] = value;
      }
    }
    parts.push(`${stop} { ${stringifyDeclarations(resolved)} }`);
  }
  return parts.join(' ');
}

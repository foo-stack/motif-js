import { resolveValue } from './token.js';
import { isStyleProp, styleProps } from './style-props.js';
import type { ResolvedStyle, Theme } from './types.js';

export interface ResolveStylesResult {
  /** CSS-shaped object ready to apply via React's `style` prop. */
  readonly style: ResolvedStyle;
  /** All non-style props, pass-through to the underlying element. */
  readonly rest: Record<string, unknown>;
}

/**
 * Walk a props bag, separating style props from everything else and resolving
 * any token references against the given theme.
 *
 * Style props that resolve to `undefined` (unknown token, unresolved ref) are
 * silently dropped. Style props that are explicitly `null` or `undefined` in
 * the input are also dropped. All other values pass through unchanged
 * (numbers stay numbers — React's inline-style auto-pixelation handles
 * length properties).
 */
export function resolveStyles(
  props: Record<string, unknown>,
  theme: Theme | undefined,
): ResolveStylesResult {
  const style: ResolvedStyle = {};
  const rest: Record<string, unknown> = {};

  for (const key in props) {
    const value = props[key];

    if (!isStyleProp(key)) {
      rest[key] = value;
      continue;
    }

    if (value === undefined || value === null) continue;

    const def = styleProps[key];
    const scale = def.scale;
    const resolved = resolveValue(
      value as string | number,
      theme,
      scale === undefined ? {} : { defaultScale: scale },
    );

    if (resolved === undefined) continue;

    if (typeof def.cssProperty === 'string') {
      style[def.cssProperty] = resolved;
    } else {
      for (const cssProp of def.cssProperty) {
        style[cssProp] = resolved;
      }
    }
  }

  return { style, rest };
}

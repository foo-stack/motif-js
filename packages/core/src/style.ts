import {
  BASE_BREAKPOINT_KEY,
  defaultBreakpoints,
  isResponsiveObject,
  mediaQueryForBreakpoint,
  type BreakpointName,
} from './breakpoints.js';
import { tokenRefToCssVar } from './css-vars.js';
import { isTokenRef, resolveValue } from './token.js';
import { isStyleProp, styleProps, type StylePropDefinition } from './style-props.js';
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

/**
 * Variant of {@link resolveStyles} for the CSS-variable path. No theme is
 * required — token references emit `var(--...)` strings that the active
 * `[data-theme]` cascade resolves at the browser level.
 *
 * Use this in tandem with `themeToCssBlock` (and a `<ThemeProvider>` that
 * mounts that block in the document). Theme switches become attribute swaps;
 * no React re-render of subscribers is needed.
 */
export function resolveStylesToVars(props: Record<string, unknown>): ResolveStylesResult {
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
    let out: string | number | undefined;

    if (typeof value === 'string' && isTokenRef(value)) {
      out = tokenRefToCssVar(value, def.scale);
      // If the ref couldn't be encoded (no defaultScale, malformed), drop.
      if (out === undefined) continue;
    } else if (typeof value === 'string' || typeof value === 'number') {
      out = value;
    } else {
      continue;
    }

    if (typeof def.cssProperty === 'string') {
      style[def.cssProperty] = out;
    } else {
      for (const cssProp of def.cssProperty) {
        style[cssProp] = out;
      }
    }
  }

  return { style, rest };
}

/**
 * Resolve a single style-prop value — literal, token ref, or non-style — into
 * a CSS-var-friendly output. Returns `undefined` if the value should be
 * dropped (null / undefined / unresolvable).
 */
function resolveSingleValueToVar(
  value: unknown,
  def: StylePropDefinition,
): string | number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string' && isTokenRef(value)) {
    return tokenRefToCssVar(value, def.scale);
  }
  if (typeof value === 'string' || typeof value === 'number') return value;
  return undefined;
}

/**
 * Apply a single style prop's resolved value to a target style object,
 * expanding shorthand (`px` → `paddingLeft` + `paddingRight`).
 */
function applyToStyle(
  target: ResolvedStyle,
  def: StylePropDefinition,
  value: string | number,
): void {
  if (typeof def.cssProperty === 'string') {
    target[def.cssProperty] = value;
  } else {
    for (const cssProp of def.cssProperty) {
      target[cssProp] = value;
    }
  }
}

export interface ResolveResponsiveResult {
  /** Style applied unconditionally (the `base` slot of any responsive object). */
  readonly baseStyle: ResolvedStyle;
  /** Rules to be wrapped in `@media (min-width: ...)` queries. */
  readonly mediaRules: ReadonlyArray<{ readonly media: string; readonly style: ResolvedStyle }>;
  /** Non-style props pass-through. */
  readonly rest: Record<string, unknown>;
}

/**
 * Like {@link resolveStylesToVars}, but additionally handles **responsive
 * object** values like `<Box p={{ base: '$2', md: '$4', lg: '$6' }} />`.
 *
 * - The `base` value (or any non-responsive single value) goes into
 *   `baseStyle`, which can be applied as inline `style`.
 * - Each named breakpoint produces a `mediaRules` entry the renderer wraps
 *   in a `@media (min-width: ...)` block and injects via a stylesheet.
 *
 * This function is renderer-agnostic — it produces the data the renderer
 * needs, but does not inject anything into the DOM.
 */
export function resolveResponsiveStylesToVars(
  props: Record<string, unknown>,
): ResolveResponsiveResult {
  const baseStyle: ResolvedStyle = {};
  const perBreakpoint: Record<string, ResolvedStyle> = {};
  const rest: Record<string, unknown> = {};

  for (const key in props) {
    const value = props[key];

    if (!isStyleProp(key)) {
      rest[key] = value;
      continue;
    }

    if (value === undefined || value === null) continue;

    const def = styleProps[key];

    if (isResponsiveObject(value)) {
      // Each breakpoint key contributes to its own slot.
      const obj = value as Record<string, unknown>;
      for (const bpKey in obj) {
        const resolved = resolveSingleValueToVar(obj[bpKey], def);
        if (resolved === undefined) continue;
        if (bpKey === BASE_BREAKPOINT_KEY) {
          applyToStyle(baseStyle, def, resolved);
        } else if (bpKey in defaultBreakpoints) {
          perBreakpoint[bpKey] ??= {};
          applyToStyle(perBreakpoint[bpKey], def, resolved);
        }
        // unknown keys are ignored — keeps the door open for future
        // shorthands without breaking forward-compat
      }
      continue;
    }

    const resolved = resolveSingleValueToVar(value, def);
    if (resolved === undefined) continue;
    applyToStyle(baseStyle, def, resolved);
  }

  // Emit media rules in breakpoint order (sm → md → lg → xl → 2xl) so that
  // higher breakpoints override lower ones in the cascade.
  const mediaRules: Array<{ media: string; style: ResolvedStyle }> = [];
  for (const bpName of Object.keys(defaultBreakpoints) as BreakpointName[]) {
    const style = perBreakpoint[bpName];
    if (style !== undefined && Object.keys(style).length > 0) {
      mediaRules.push({ media: mediaQueryForBreakpoint(bpName), style });
    }
  }

  return { baseStyle, mediaRules, rest };
}

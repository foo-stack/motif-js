import {
  containerQueryForBreakpoint,
  defaultBreakpoints,
  isResponsiveObject,
  mediaQueryForBreakpoint,
  parseResponsiveDSL,
  parseResponsiveKey,
  responsiveArrayToObject,
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

/**
 * A single CSS at-rule produced by the responsive resolver. The renderer
 * wraps the supplied style in a class selector under this at-rule.
 *
 * `atRule` is the full prefix, e.g. `@media (min-width: 768px)` or
 * `@container card (min-width: 1024px)`.
 */
export interface AtRule {
  readonly atRule: string;
  readonly style: ResolvedStyle;
}

export interface ResolveResponsiveResult {
  /** Style applied unconditionally (the `base` slot of any responsive object). */
  readonly baseStyle: ResolvedStyle;
  /**
   * At-rules to be injected as class-scoped CSS. Emitted in cascade order:
   * media first (least specific), then anonymous container queries, then
   * named container queries (alphabetical). Within each group, breakpoints
   * are mobile-first (sm → 2xl).
   */
  readonly atRules: ReadonlyArray<AtRule>;
  /** Non-style props pass-through. */
  readonly rest: Record<string, unknown>;
}

type StylePerBp = Partial<Record<BreakpointName, ResolvedStyle>>;

const BREAKPOINT_ORDER = Object.keys(defaultBreakpoints) as readonly BreakpointName[];

/**
 * Like {@link resolveStylesToVars}, but additionally handles **responsive
 * object** values. Both media-query and container-query keys are supported
 * within the same object:
 *
 * - `base` → unconditional (inline style).
 * - `<bp>` (e.g. `md`) → `@media (min-width: ...)`.
 * - `@<bp>` (e.g. `@md`) → `@container (min-width: ...)` against the nearest
 *   container ancestor.
 * - `@<name>.<bp>` (e.g. `@card.md`) → `@container <name> (min-width: ...)`.
 *
 * Renderer-agnostic: produces the data the renderer needs but does not inject
 * anything into the DOM.
 */
export function resolveResponsiveStylesToVars(
  props: Record<string, unknown>,
): ResolveResponsiveResult {
  const baseStyle: ResolvedStyle = {};
  const mediaPerBp: StylePerBp = {};
  const anonContainerPerBp: StylePerBp = {};
  const namedContainerPerBp: Record<string, StylePerBp> = {};
  const rest: Record<string, unknown> = {};

  for (const key in props) {
    const value = props[key];

    if (!isStyleProp(key)) {
      rest[key] = value;
      continue;
    }

    if (value === undefined || value === null) continue;

    const def = styleProps[key];

    const responsive: Record<string, unknown> | null = Array.isArray(value)
      ? responsiveArrayToObject(value)
      : isResponsiveObject(value)
        ? (value as Record<string, unknown>)
        : typeof value === 'string'
          ? parseResponsiveDSL(value)
          : null;

    if (responsive !== null) {
      const obj = responsive;
      for (const bpKey in obj) {
        const parsed = parseResponsiveKey(bpKey);
        if (parsed === null) continue;

        const resolved = resolveSingleValueToVar(obj[bpKey], def);
        if (resolved === undefined) continue;

        if (parsed.kind === 'base') {
          applyToStyle(baseStyle, def, resolved);
        } else if (parsed.kind === 'media') {
          mediaPerBp[parsed.bp] ??= {};
          applyToStyle(mediaPerBp[parsed.bp]!, def, resolved);
        } else if (parsed.name === undefined) {
          anonContainerPerBp[parsed.bp] ??= {};
          applyToStyle(anonContainerPerBp[parsed.bp]!, def, resolved);
        } else {
          const bucket = (namedContainerPerBp[parsed.name] ??= {});
          bucket[parsed.bp] ??= {};
          applyToStyle(bucket[parsed.bp]!, def, resolved);
        }
      }
      continue;
    }

    const resolved = resolveSingleValueToVar(value, def);
    if (resolved === undefined) continue;
    applyToStyle(baseStyle, def, resolved);
  }

  const atRules: AtRule[] = [];

  // 1. Media queries — least specific, emitted first so containers override.
  for (const bp of BREAKPOINT_ORDER) {
    const style = mediaPerBp[bp];
    if (style !== undefined && Object.keys(style).length > 0) {
      atRules.push({ atRule: mediaQueryForBreakpoint(bp), style });
    }
  }

  // 2. Anonymous container queries — bind to nearest container ancestor.
  for (const bp of BREAKPOINT_ORDER) {
    const style = anonContainerPerBp[bp];
    if (style !== undefined && Object.keys(style).length > 0) {
      atRules.push({ atRule: containerQueryForBreakpoint(bp), style });
    }
  }

  // 3. Named container queries — alphabetical by name for determinism.
  const names = Object.keys(namedContainerPerBp).sort();
  for (const name of names) {
    const bucket = namedContainerPerBp[name]!;
    for (const bp of BREAKPOINT_ORDER) {
      const style = bucket[bp];
      if (style !== undefined && Object.keys(style).length > 0) {
        atRules.push({ atRule: containerQueryForBreakpoint(bp, name), style });
      }
    }
  }

  return { baseStyle, atRules, rest };
}

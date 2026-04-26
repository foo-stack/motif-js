/**
 * Core token and theme types.
 *
 * motif-js uses a two-layer token model:
 *
 *   - **Primitive tokens** are the palette: `colors.blue.500`, `space.4`,
 *     `radii.md`. They are theme-independent; the literal hex / pixel values.
 *
 *   - **Semantic tokens** reference primitives by intent: `action.primary.bg`,
 *     `surface.raised`, `text.muted`. They swap their underlying primitive
 *     when the active theme changes.
 *
 * Both layers live inside a `Theme.tokens` tree. The shape is recursive: a
 * scale (e.g. `colors`) may contain nested groups (e.g. `colors.blue.500`)
 * arbitrarily deep, and any leaf may be a literal value OR a `$`-prefixed
 * token reference that points at another node.
 */

/** Permissible primitive token leaf values. */
export type TokenValue = string | number;

/**
 * A `$`-prefixed token reference. Example: `'$colors.blue.500'` or
 * `'$action.primary.bg'`. The resolver walks the dotted path inside the
 * theme's token tree.
 */
export type TokenRef = `$${string}`;

/**
 * A node in the token tree: either a leaf value, a token reference (which
 * resolves to another leaf), or another nested scale.
 */
export type TokenNode<V extends TokenValue = TokenValue> = V | TokenRef | TokenScale<V>;

/** A nested map of token nodes. Recursive. */
export interface TokenScale<V extends TokenValue = TokenValue> {
  [key: string]: TokenNode<V>;
}

/**
 * The full token map of a theme. Each top-level key is a scale name
 * (`colors`, `space`, `fontSizes`, ...). Default scale set covers the
 * common CSS properties; user themes may add custom scales.
 */
export interface TokenMap {
  colors?: TokenScale<string>;
  space?: TokenScale<number | string>;
  sizes?: TokenScale<number | string>;
  radii?: TokenScale<number | string>;
  fontSizes?: TokenScale<number | string>;
  fontWeights?: TokenScale<number | string>;
  fontFamilies?: TokenScale<string>;
  lineHeights?: TokenScale<number | string>;
  letterSpacings?: TokenScale<number | string>;
  shadows?: TokenScale<string>;
  zIndices?: TokenScale<number>;
  borderWidths?: TokenScale<number | string>;
  opacities?: TokenScale<number>;
  durations?: TokenScale<string>;
  easings?: TokenScale<string>;
  // Allow user-defined scales without breaking type-safety for known ones.
  [scale: string]: TokenScale<TokenValue> | undefined;
}

/**
 * Canonical scale names known to the style-prop schema. Every entry in
 * `TokenMap` that maps to a CSS property is keyed by one of these.
 */
export type ScaleName =
  | 'colors'
  | 'space'
  | 'sizes'
  | 'radii'
  | 'fontSizes'
  | 'fontWeights'
  | 'fontFamilies'
  | 'lineHeights'
  | 'letterSpacings'
  | 'shadows'
  | 'zIndices'
  | 'borderWidths'
  | 'opacities'
  | 'durations'
  | 'easings';

/**
 * A complete theme definition: a name plus the full token tree. Themes can
 * be nested via `<Theme>` boundaries; the resolver always uses the closest
 * theme in scope.
 */
export interface Theme {
  /** Unique name, used as `data-theme` attribute on web. */
  readonly name: string;
  /** Full token tree (primitives + semantics interleaved). */
  readonly tokens: TokenMap;
}

/**
 * A CSS-shaped object after style-prop resolution. Values are plain strings
 * or numbers; all token references have been resolved.
 */
export type ResolvedStyle = Record<string, string | number>;

/** A literal CSS value, allowing both string forms and numbers. */
export type CSSValue = string | number;

/**
 * The value a style prop may receive: a literal CSS value or a token
 * reference. Responsive shorthands (object / array / DSL) are layered on top
 * in the responsive module.
 */
export type StyleValue<V extends CSSValue = CSSValue> = V | TokenRef;

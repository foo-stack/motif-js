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
  /**
   * Named-curve animation presets. Each entry resolves to at least a
   * `{ duration, easing }` pair on web (CSS transitions) and on
   * native (driver timing). Spring-style fields (`type: 'spring'`,
   * `damping`, `mass`, `stiffness`) are honoured by the native
   * Reanimated driver and approximated to a `cubic-bezier(...)`
   * easing on web. Stored as a flat record (not a recursive
   * `TokenScale`) because animation tokens are object leaves, not
   * primitive `string | number` values.
   *
   * The catch-all index signature below intentionally excludes this
   * field's shape; animations are looked up via a dedicated helper
   * (`resolveAnimationToken`), not the generic `resolveToken` path.
   */
  animations?: Readonly<Record<string, AnimationToken>>;
  // Allow user-defined scales without breaking type-safety for known ones.
  [scale: string]: TokenScale<TokenValue> | Readonly<Record<string, AnimationToken>> | undefined;
}

/**
 * One animation preset entry. Can be expressed as a plain
 * `{ duration, easing }` (timing animation) or as a spring config
 * `{ type: 'spring', damping?, mass?, stiffness? }`. `duration` and
 * `easing` accept literal CSS values OR `$durations.<n>` /
 * `$easings.<name>` token references.
 */
export type AnimationToken = TimingAnimationToken | SpringAnimationToken;

export interface TimingAnimationToken {
  readonly type?: 'timing';
  readonly duration?: string;
  readonly easing?: string;
}

export interface SpringAnimationToken {
  readonly type: 'spring';
  /** Mass of the animated object. Higher = slower. Default 1. */
  readonly mass?: number;
  /** Damping ratio. Higher = less oscillation. Default 10. */
  readonly damping?: number;
  /** Spring stiffness. Higher = faster snap. Default 100. */
  readonly stiffness?: number;
  /** Web-only: explicit cubic-bezier override. When omitted, motif
   * approximates the spring with a fitted bezier. */
  readonly easing?: string;
  /** Web-only: explicit duration override. When omitted, motif
   * estimates from the spring parameters. */
  readonly duration?: string;
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
  | 'easings'
  | 'animations';

/**
 * A complete theme definition: a name plus the full token tree. Themes can
 * be nested via `<Theme>` boundaries; the resolver always uses the closest
 * theme in scope.
 *
 * The optional `fonts`, `root`, and `reducedMotion` fields drive web-only
 * runtime emission from `<ThemeProvider>` — `@font-face` declarations,
 * `body` / `::selection` resets, and the `prefers-reduced-motion` guard.
 * They are no-ops on native (the engine has no global stylesheet).
 */
export interface Theme {
  /** Unique name, used as `data-theme` attribute on web. */
  readonly name: string;
  /** Full token tree (primitives + semantics interleaved). */
  readonly tokens: TokenMap;
  /**
   * `@font-face` declarations to emit alongside this theme. Deduped
   * across themes by `(family, weight, style, src)` — light and dark
   * typically share the same font assets, so registering the family on
   * one theme is enough.
   */
  readonly fonts?: readonly FontFace[];
  /**
   * Body and `::selection` styles to emit at the document root. Token
   * references resolve via the CSS-variable cascade, so a single
   * declaration like `background: '$colors.bg.base'` flips automatically
   * when the active theme changes.
   *
   * For `body` resets to take effect, the `data-theme` attribute must
   * sit on `<html>` or `<body>` (not the `<ThemeProvider>` wrapper div).
   * Most apps already follow this convention.
   */
  readonly root?: ThemeRootStyles;
  /**
   * `prefers-reduced-motion` policy.
   *
   *   - `'guard'` (default when any theme sets the field): emit a
   *     `@media (prefers-reduced-motion: reduce)` block that forces all
   *     animations and transitions to ~0ms.
   *   - `'off'`: skip emission. Use this when the consuming app handles
   *     the guard itself.
   */
  readonly reducedMotion?: ReducedMotionMode;
}

/**
 * One `@font-face` source. A bare URL string is shorthand for a single
 * `{ url, format: <auto-detected> }` entry; pass an array of objects when
 * you need to provide multiple formats or `tech()` annotations.
 */
export interface FontSource {
  readonly url: string;
  readonly format?:
    | 'woff2'
    | 'woff'
    | 'truetype'
    | 'opentype'
    | 'embedded-opentype'
    | 'svg'
    | string;
  /** `tech()` descriptor — e.g. `'variations'` for variable fonts. */
  readonly tech?: string;
}

/**
 * One `@font-face` declaration. Field names mirror the CSS spec; required
 * fields are `family` and `src`.
 */
export interface FontFace {
  /** Font family name, as referenced from token scales (`fontFamilies`). */
  readonly family: string;
  /** Source URL or list of `{ url, format, tech }` alternatives. */
  readonly src: string | readonly FontSource[];
  readonly weight?: number | string;
  readonly style?: 'normal' | 'italic' | 'oblique' | string;
  readonly display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  readonly stretch?: string;
  readonly unicodeRange?: string;
  readonly fontVariationSettings?: string;
  readonly fontFeatureSettings?: string;
}

/**
 * Body / `::selection` resets emitted at the document root. Values may
 * be literal CSS or `$`-prefixed token references — the latter resolve
 * via the CSS-variable cascade, so a single declaration tracks the
 * active theme automatically.
 */
export interface ThemeRootStyles {
  readonly background?: StyleValue;
  readonly color?: StyleValue;
  readonly fontFamily?: StyleValue;
  readonly fontSize?: StyleValue;
  readonly fontWeight?: StyleValue;
  readonly lineHeight?: StyleValue;
  readonly letterSpacing?: StyleValue;
  readonly fontFeatureSettings?: StyleValue;
  readonly fontVariationSettings?: StyleValue;
  readonly textRendering?: StyleValue;
  readonly WebkitFontSmoothing?: StyleValue;
  readonly MozOsxFontSmoothing?: StyleValue;
  /** `::selection { background-color: ... }` */
  readonly selectionBackground?: StyleValue;
  /** `::selection { color: ... }` */
  readonly selectionColor?: StyleValue;
}

/** `prefers-reduced-motion` policy — see {@link Theme.reducedMotion}. */
export type ReducedMotionMode = 'guard' | 'off';

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

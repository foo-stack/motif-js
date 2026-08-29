/**
 * Deriving `$`-reference types from a theme's token tree.
 *
 * These are types only; nothing here emits runtime code. They exist so a
 * consumer's theme can drive what a `$` reference is allowed to say, instead
 * of every reference being the opaque `TokenRef` (`` `$${string}` ``).
 *
 * The source has to be a literal token object, normally `typeof myTheme`
 * from {@link createTheme}. A declared interface cannot work: `TokenScale`
 * carries `[key: string]: TokenNode<V>`, and an index signature puts `string`
 * back into `keyof`, which collapses every derived union to `string`.
 */

/**
 * The union of dotted leaf paths through a token tree.
 *
 * Object nodes recurse; every other node is a leaf. A token whose value is
 * itself a `$` reference is a leaf too, because a `TokenRef` is a string:
 * `{ primary: '$colors.brand.500' }` yields `'primary'`, not a path into the
 * reference it points at.
 *
 * Numeric keys are included because token scales are routinely keyed by
 * number (`space.4`, `colors.gray.500`). TypeScript widens those keys to
 * their string form inside a template literal, which is what callers want:
 * the emitted reference is `$space.4`.
 *
 * @example
 *   type P = Paths<{ brand: { 500: '#3b82f6' }; fg: '#000' }>;
 *   //   => 'brand.500' | 'fg'
 */
export type Paths<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object ? `${K}.${Paths<T[K]>}` : `${K}`;
    }[keyof T & (string | number)]
  : never;

/**
 * A `$`-prefixed reference into one named scale of a token map.
 *
 * Generic over the token map rather than reading a global theme, because
 * nothing has bound a consumer's theme at this layer yet.
 *
 * **Keep references scoped to a single scale.** Handing a style prop the
 * union of every scale's paths measured 8 to 9 times the type-check cost of
 * the per-scale form at realistic call-site volume, and it is the one shape
 * choice here that matters for performance.
 *
 * @example
 *   type Space = ScalePath<typeof theme.tokens, 'space'>;
 *   //   => '$space.4' | '$space.8'
 */
export type ScalePath<TTokens, S extends keyof TTokens & string> = `$${S}.${Paths<TTokens[S]>}`;

/**
 * The scale names a token map is expected to carry.
 *
 * `animations` is deliberately absent. It is a flat
 * `Record<string, AnimationToken>` of object leaves rather than a recursive
 * `TokenScale`, and it resolves through `resolveAnimationToken` rather than
 * the generic `$`-path walk, so deriving dotted paths into it would describe
 * lookups that do not happen.
 *
 * A theme may define scales beyond these; `ScalePath` accepts any key its
 * token map actually has.
 */
export type KnownScaleName =
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

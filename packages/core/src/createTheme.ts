import type { FontFace, ReducedMotionMode, Theme, ThemeRootStyles, TokenMap } from './types.js';

/**
 * Construct a theme. A pass-through factory that preserves the literal
 * `tokens` shape, so a caller can derive `$`-reference types from it.
 *
 * `fonts`, `root`, and `reducedMotion` are optional web-only emission
 * hints picked up by `<ThemeProvider>` (see {@link Theme}). They have
 * no effect on native.
 */
// The `Omit` in the return type is load-bearing and looks removable.
// `Theme` declares `tokens: TokenMap`, so intersecting it with
// `{ tokens: T }` yields `TokenMap & T` rather than `T`. `TokenMap`'s
// scales are `TokenScale`, which carries `[key: string]: TokenNode<V>`,
// and that index signature puts `string` back into `keyof`, collapsing
// any path union derived from the result to `string`. Dropping `Theme`'s
// own `tokens` first is what keeps the literal shape reachable.
// `token-path.test-d.ts` fails if this is reverted.
export function createTheme<T extends TokenMap>(def: {
  readonly name: string;
  readonly tokens: T;
  readonly fonts?: readonly FontFace[];
  readonly root?: ThemeRootStyles;
  readonly reducedMotion?: ReducedMotionMode;
}): Omit<Theme, 'tokens'> & { readonly tokens: T } {
  return def;
}

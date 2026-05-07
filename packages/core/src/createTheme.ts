import type { FontFace, ReducedMotionMode, Theme, ThemeRootStyles, TokenMap } from './types.js';

/**
 * Construct a theme. A pass-through factory that narrows the `tokens`
 * type so `$`-references to specific scales are typed in callers.
 *
 * `fonts`, `root`, and `reducedMotion` are optional web-only emission
 * hints picked up by `<ThemeProvider>` (see {@link Theme}). They have
 * no effect on native.
 */
export function createTheme<T extends TokenMap>(def: {
  readonly name: string;
  readonly tokens: T;
  readonly fonts?: readonly FontFace[];
  readonly root?: ThemeRootStyles;
  readonly reducedMotion?: ReducedMotionMode;
}): Theme & { readonly tokens: T } {
  return def;
}

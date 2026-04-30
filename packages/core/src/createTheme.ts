import type { Theme, TokenMap } from './types.js';

/**
 * Construct a theme. A pass-through factory that narrows the `tokens`
 * type so `$`-references to specific scales are typed in callers.
 */
export function createTheme<T extends TokenMap>(def: {
  readonly name: string;
  readonly tokens: T;
}): Theme & { readonly tokens: T } {
  return def;
}

import type { Theme } from '@motif-js/core';
import { createContext, useContext } from 'react';

/**
 * Native theme context. Unlike the web renderer (which threads themes
 * via CSS variables and `[data-theme]` attribute swaps), native uses a
 * plain React context. Theme switches re-render every component that
 * read styles from the theme — fine on RN since the StyleSheet path
 * doesn't have a CSS-cascade equivalent to lean on.
 */
export interface ThemeContextValue {
  /** All themes registered at the nearest `<ThemeProvider>`. */
  readonly themes: readonly Theme[];
  /** Active theme's `name`. */
  readonly active: string;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Returns the currently active theme object, or `undefined` if no
 * `<ThemeProvider>` is in scope. Components that need literal token
 * values (e.g. `Box`'s style resolution) call this internally.
 */
export function useTheme(): Theme | undefined {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) return undefined;
  return ctx.themes.find((t) => t.name === ctx.active);
}

/**
 * Returns the active theme NAME without re-resolving the theme object.
 * Cheap subscription for "are we in dark mode?" style checks.
 */
export function useThemeName(): string | undefined {
  return useContext(ThemeContext)?.active;
}

'use client';

import type { Theme } from '@motif-js/core';
import { createContext, useContext } from 'react';

/**
 * Internal theme context. Carries the registered themes and the name of the
 * currently active one. Components don't need to consume this for rendering
 * — style props always emit `var(--…)` references that resolve via the CSS
 * cascade — but it's available for reflection (`useTheme()`).
 */
export interface ThemeContextValue {
  /** All themes registered at the nearest provider. */
  readonly themes: readonly Theme[];
  /** Name of the active theme (matches `data-theme` on the wrapper). */
  readonly active: string;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Returns the currently active theme object, or `undefined` if no
 * `<ThemeProvider>` is in scope.
 *
 * Most components should NOT need this — style props compile to CSS vars and
 * resolve at the browser via the data-theme cascade. Use only for runtime
 * decisions that genuinely depend on theme name (e.g. picking an SVG asset
 * variant).
 */
export function useTheme(): Theme | undefined {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) return undefined;
  return ctx.themes.find((t) => t.name === ctx.active);
}

/**
 * Returns the active theme NAME without re-resolving the theme object. Cheap
 * subscription for code that just needs to know "are we in dark mode?".
 */
export function useThemeName(): string | undefined {
  return useContext(ThemeContext)?.active;
}

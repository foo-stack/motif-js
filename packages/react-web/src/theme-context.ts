import type { Theme } from '@motif-js/core';
import { createContext, useContext } from 'react';

/**
 * The theme context.
 *
 * Rendering with `undefined` is a deliberate "no theme installed" state —
 * components fall back to literal-only style props (token references won't
 * resolve). In Phase B this becomes a `ThemeProvider`-wrapped CSS-variable
 * scope; for Phase A the context object itself is the theme source.
 */
export const ThemeContext = createContext<Theme | undefined>(undefined);

/** Read the closest theme in scope. Returns `undefined` outside any provider. */
export function useTheme(): Theme | undefined {
  return useContext(ThemeContext);
}

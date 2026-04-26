import type { Theme as ThemeType } from '@motif-js/core';
import type { ReactNode } from 'react';
import { ThemeContext } from './theme-context.js';

export interface ThemeProviderProps {
  /** The theme to make active for descendants. */
  theme: ThemeType;
  children?: ReactNode;
}

/**
 * Top-level theme provider. Place this once near the root of the app to
 * supply the active theme. Sets `data-theme` on the wrapping element so
 * the future CSS-variable-driven theming (Phase B) can use the cascade.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <div data-theme={theme.name}>{children}</div>
    </ThemeContext.Provider>
  );
}

export interface ThemeProps {
  /** The theme to apply to this subtree. */
  theme: ThemeType;
  children?: ReactNode;
}

/**
 * Nested sub-theme boundary. Wraps any subtree with a different active
 * theme — components inside resolve tokens against this theme, while
 * descendants of a parent provider outside this boundary keep their
 * original theme.
 *
 * Example:
 *
 * ```tsx
 * <ThemeProvider theme={lightTheme}>
 *   <Box bg="$colors.surface.base">  // light surface
 *     <Theme theme={darkTheme}>
 *       <Box bg="$colors.surface.base"> // dark surface island
 *     </Theme>
 *   </Box>
 * </ThemeProvider>
 * ```
 */
export function Theme({ theme, children }: ThemeProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <div data-theme={theme.name}>{children}</div>
    </ThemeContext.Provider>
  );
}

import { useContext, useMemo, type ReactNode } from 'react';
import type { Theme as ThemeType } from '@motif-js/core';
import { ThemeContext, type ThemeContextValue } from './theme-context.js';

export interface ThemeProviderProps {
  /**
   * All themes available at this scope. Pre-registered so `<Theme>`
   * boundaries below can switch by name without re-uploading the
   * token tree on every change.
   */
  themes: readonly ThemeType[];
  /**
   * Name of the active theme. Must match the `name` of one of `themes`;
   * an unknown name leaves descendants with `useTheme()` returning
   * `undefined`.
   */
  active: string;
  children?: ReactNode;
}

/**
 * Root native theme provider. Threads the active theme through React
 * context. Switching `active` re-renders every consumer of
 * `useTheme()` (Box, future Stack/Text/etc.) with the new token
 * values — native has no CSS-variable cascade to lean on.
 */
export function ThemeProvider({ themes, active, children }: ThemeProviderProps) {
  const value: ThemeContextValue = useMemo(() => ({ themes, active }), [themes, active]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export interface ThemeProps {
  /**
   * Name of the theme to apply to this subtree. Must be a name
   * registered with the nearest enclosing `<ThemeProvider>`; otherwise
   * descendants get an `undefined` resolved theme.
   */
  name: string;
  children?: ReactNode;
}

/**
 * Nested theme boundary. Reads the registered `themes` list from the
 * surrounding context and rebinds `active` to `name`. The outer
 * `themes` array is preserved — no need to re-pass it.
 *
 * @example
 *
 * ```tsx
 * <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
 *   <Box bg="$colors.surface.base">
 *     <Theme name="dark">
 *       <Box bg="$colors.surface.base">{/* dark surface island *\/}</Box>
 *     </Theme>
 *   </Box>
 * </ThemeProvider>
 * ```
 */
export function Theme({ name, children }: ThemeProps) {
  const outer = useContext(ThemeContext);
  const value: ThemeContextValue = useMemo(
    () => ({ themes: outer?.themes ?? [], active: name }),
    [outer?.themes, name],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

import { useContext, useMemo, type ReactNode } from 'react';
import { type BreakpointName, configureBreakpoints, type Theme as ThemeType } from '@usemotif/core';
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
  /**
   * Override the breakpoint pixel widths for this app. Merges over the
   * defaults (the five names — `sm`/`md`/`lg`/`xl`/`2xl` — are fixed; only
   * their widths change). A convenience for calling `configureBreakpoints()`
   * at app entry: `useMedia`/`useBreakpoint` and `Adapt`/`Show`/`Hide` then
   * resolve against these widths. Treat it as static app config: set it once
   * and don't vary it at runtime.
   */
  breakpoints?: Partial<Record<BreakpointName, number>>;
  children?: ReactNode;
}

/**
 * Root native theme provider. Threads the active theme through React
 * context. Switching `active` re-renders every consumer of
 * `useTheme()` (Box, future Stack/Text/etc.) with the new token
 * values — native has no CSS-variable cascade to lean on.
 */
export function ThemeProvider({ themes, active, breakpoints, children }: ThemeProviderProps) {
  // Set the breakpoint config during render, before descendants read it via
  // useMedia/Adapt. Idempotent, deterministic static app config.
  if (breakpoints !== undefined) configureBreakpoints(breakpoints);
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

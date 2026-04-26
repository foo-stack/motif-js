import { themesToCssBlock, type Theme as ThemeType } from '@motif-js/core';
import { useMemo, type ReactNode } from 'react';
import { ThemeContext, type ThemeContextValue } from './theme-context.js';

export interface ThemeProviderProps {
  /**
   * All themes available at this scope. Their CSS-variable definitions are
   * emitted once via a `<style>` element so theme switches become attribute
   * swaps rather than React re-renders.
   */
  themes: readonly ThemeType[];
  /**
   * Name of the active theme. Must match the `name` of one of `themes`,
   * otherwise CSS variables fall back to browser defaults.
   */
  active: string;
  children?: ReactNode;
}

/**
 * Top-level theme provider.
 *
 * Renders a `<style>` element containing every theme's tokens, scoped to
 * `[data-theme="<name>"]`. Wraps `children` in a container that carries the
 * active theme name on its `data-theme` attribute. Switching themes amounts
 * to changing that attribute — the CSS cascade does the rest, no React
 * re-renders required.
 */
export function ThemeProvider({ themes, active, children }: ThemeProviderProps) {
  const cssBlock = useMemo(() => themesToCssBlock(themes), [themes]);
  const value: ThemeContextValue = useMemo(() => ({ themes, active }), [themes, active]);

  return (
    <ThemeContext.Provider value={value}>
      <style data-motif-themes="root" dangerouslySetInnerHTML={{ __html: cssBlock }} />
      <div data-theme={active}>{children}</div>
    </ThemeContext.Provider>
  );
}

export interface ThemeProps {
  /**
   * Name of the theme to apply to this subtree. Must be a name registered
   * with the nearest `<ThemeProvider>`; the CSS variables for that theme
   * are already in the document, so the cascade picks up the new values.
   */
  name: string;
  children?: ReactNode;
}

/**
 * Nested sub-theme boundary. Switches the active theme for descendants by
 * setting `data-theme` on a wrapping element. CSS-variable cascade handles
 * the visual change without touching React state.
 *
 * @example
 *
 * ```tsx
 * <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
 *   <Box bg="$colors.surface.base">
 *     <Theme name="dark">
 *       <Box bg="$colors.surface.base">  // dark surface island
 *     </Theme>
 *   </Box>
 * </ThemeProvider>
 * ```
 */
export function Theme({ name, children }: ThemeProps) {
  // Note: we don't update ThemeContext here. The visual change is purely a
  // CSS-cascade effect; reflection via `useTheme()` continues to report the
  // top-level provider's active theme. If we ever need the nested theme
  // reflected in context, that's an opt-in extension.
  return <div data-theme={name}>{children}</div>;
}

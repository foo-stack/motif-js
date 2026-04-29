'use client';

import { themesToCssBlock, type Theme as ThemeType } from '@motif-js/core';
import { useContext, useMemo, type ReactNode } from 'react';
import { ThemeContext, type ThemeContextValue } from './theme-context.js';

export interface ThemeProviderProps {
  /**
   * All themes available at this scope. Their CSS-variable definitions
   * are emitted once via a `<style>` element so theme switches become
   * attribute swaps rather than React re-renders.
   *
   * For chainable / composable sub-themes, register the combination
   * themes (e.g. `dark_red`) alongside the root ones — they're picked
   * up automatically when a `<Theme>` boundary chain produces a name
   * that matches.
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
 * Renders a `<style>` element containing every theme's tokens, scoped
 * to `[data-theme="<name>"]`. Wraps `children` in a container that
 * carries the active theme name on its `data-theme` attribute.
 * Switching themes amounts to changing that attribute — the CSS
 * cascade does the rest, no React re-renders required.
 */
export function ThemeProvider({ themes, active, children }: ThemeProviderProps) {
  const cssBlock = useMemo(() => themesToCssBlock(themes), [themes]);
  const value: ThemeContextValue = useMemo(
    () => ({ themes, active, chain: [active] }),
    [themes, active],
  );

  return (
    <ThemeContext.Provider value={value}>
      <style data-motif-themes="root" dangerouslySetInnerHTML={{ __html: cssBlock }} />
      <div data-theme={active}>{children}</div>
    </ThemeContext.Provider>
  );
}

export interface ThemeProps {
  /**
   * Name of the theme to apply to this subtree. Combined with the
   * parent chain, motif looks up a registered combination theme —
   * e.g. inside `<ThemeProvider active="dark">`, `<Theme name="red">`
   * looks for a `'dark_red'` theme, falling back to the inner name
   * `'red'` (or the parent name) if no combination is registered.
   */
  name: string;
  children?: ReactNode;
}

/**
 * Nested sub-theme boundary. Switches the active theme for descendants
 * by setting `data-theme` on a wrapping element. CSS-variable cascade
 * handles the visual change without touching React state.
 *
 * **Chainable / composable**: when nested inside a parent `<Theme>` (or
 * `<ThemeProvider>`), motif composes the names with `_` and looks for a
 * registered combination theme. Pre-generate the combinations you care
 * about and pass them all to `<ThemeProvider themes={...}>` — they
 * activate automatically when the chain matches.
 *
 * @example
 *
 * ```tsx
 * <ThemeProvider themes={[light, dark, light_red, dark_red]} active="dark">
 *   <Box bg="$colors.surface.base">          // dark
 *     <Theme name="red">
 *       <Box bg="$colors.surface.base">      // dark_red
 *     </Theme>
 *   </Box>
 * </ThemeProvider>
 * ```
 */
export function Theme({ name, children }: ThemeProps) {
  const parent = useContext(ThemeContext);
  const themes = parent?.themes ?? [];

  // Chain composition: inherit the parent chain (or start fresh if no
  // provider is in scope) and append this boundary's name.
  const chain: readonly string[] = parent === undefined ? [name] : [...parent.chain, name];

  // Resolve the name to apply: prefer the deepest registered combo
  // (`dark_red_blue` → `dark_red` → `red`), falling back to the parent
  // active name if nothing in this branch is registered.
  const resolved = resolveActiveName(themes, chain, parent?.active);

  const value: ThemeContextValue = useMemo(
    () => ({ themes, active: resolved, chain }),
    // chain identity is stable per composition path; resolved tracks chain.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themes, resolved, chain.join('_')],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={resolved}>{children}</div>
    </ThemeContext.Provider>
  );
}

/**
 * Resolve the chain to the most appropriate registered theme name.
 *
 * Priority (most specific → least):
 *
 * 1. **Full chain combo** (`dark_red_blue`) — registered combinations
 *    are exactly what they're for; if one matches, use it.
 * 2. **Inner name** (last chain element, e.g. `red`) — preserves the
 *    user's explicit `<Theme>` intent when no combo is registered.
 * 3. **Parent's resolved active** — the cascade keeps inheriting from
 *    the parent boundary if neither of the above matched. For 3-deep
 *    chains this naturally drops to `dark_red` etc., because the
 *    parent `<Theme red>` boundary already resolved to `dark_red`.
 *
 * No SVG-style "drop one at a time from each end" combinatorial walk
 * — that's expensive and surprising. The above three steps are
 * deterministic, easy to reason about, and cover the cases that
 * matter for real apps.
 */
function resolveActiveName(
  themes: readonly ThemeType[],
  chain: readonly string[],
  parentActive: string | undefined,
): string {
  const names = new Set(themes.map((t) => t.name));
  const fullChain = chain.join('_');
  if (names.has(fullChain)) return fullChain;
  const inner = chain.at(-1);
  if (inner !== undefined && names.has(inner)) return inner;
  return parentActive ?? inner ?? '';
}

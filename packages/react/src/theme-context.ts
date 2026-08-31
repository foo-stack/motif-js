'use client';

import { type BreakpointName, getBreakpoints, type Theme } from '@usemotif/core';
import { createContext, useContext } from 'react';

/**
 * Internal theme context. Carries the registered themes, the active
 * theme name (what `data-theme` is set to in the cascade), and the
 * chain of nested `<Theme>` boundaries that produced it.
 *
 * Components don't need to consume this for rendering - style props
 * always emit `var(--...)` references that resolve via the CSS cascade
 * - but it's available for reflection via `useTheme()`,
 * `useThemeName()`, and `useThemeChain()`.
 */
export interface ThemeContextValue {
  /** All themes registered at the nearest provider. Includes any pre-
   * generated combination themes (e.g. `'dark_red'`) the consumer
   * passed in alongside their root themes. */
  readonly themes: readonly Theme[];
  /** Resolved name applied to `data-theme` at the current scope.
   * Either a single name (`'dark'`) or a chained combo
   * (`'dark_red'`) if such a theme is registered. */
  readonly active: string;
  /** The chain of theme names from the root provider down to the
   * current scope. `<ThemeProvider active="dark">` initialises this
   * to `['dark']`; each nested `<Theme name="X">` appends `X`. */
  readonly chain: readonly string[];
  /** Resolved breakpoint pixel widths for this render tree (the
   * `<ThemeProvider breakpoints>` override over the defaults). The per-tree
   * source read via {@link useBreakpointWidths}. Optional so a hand-built value
   * can omit it and fall back to the global; providers always populate it. */
  readonly breakpoints?: Readonly<Record<BreakpointName, number>>;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Returns the currently active theme object, or `undefined` if no
 * `<ThemeProvider>` is in scope. Resolves against the deepest scope's
 * `active` name - so inside a `<Theme name="red">` nested under a
 * `<ThemeProvider active="dark">`, this returns `dark_red` if that
 * combo theme is registered, falling back to the inner-most name
 * `red` (or, ultimately, the root `dark`) if not.
 *
 * Most components should NOT need this - style props compile to CSS
 * vars and resolve at the browser via the data-theme cascade. Use
 * only for runtime decisions that genuinely depend on theme name.
 */
export function useTheme(): Theme | undefined {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) return undefined;
  return ctx.themes.find((t) => t.name === ctx.active);
}

/**
 * Returns the active theme NAME without re-resolving the theme object.
 * Inside nested `<Theme>` boundaries this reflects the chained name -
 * e.g. `'dark_red'` for `<ThemeProvider active="dark"><Theme name="red">`
 * if that combination is registered, otherwise the deepest-registered
 * fallback (`'red'` if registered alone; else `'dark'`).
 */
export function useThemeName(): string | undefined {
  return useContext(ThemeContext)?.active;
}

/**
 * Returns the full chain of theme names from the root provider down to
 * the current scope. `<ThemeProvider active="dark"><Theme name="red">`
 * yields `['dark', 'red']` regardless of whether the combo theme
 * `'dark_red'` is actually registered. Useful for build-time tooling
 * or instrumentation that wants to see the boundary structure rather
 * than the resolved name.
 */
export function useThemeChain(): readonly string[] | undefined {
  return useContext(ThemeContext)?.chain;
}

/**
 * The breakpoint pixel widths for the current render tree - the nearest
 * `<ThemeProvider breakpoints>` override, or the process-global when no
 * provider is mounted. The single per-tree source the JS match paths read
 * (`Show`/`Hide`, native responsive props, `Adapt`), so they agree and
 * concurrent SSR requests resolve independently.
 */
export function useBreakpointWidths(): Readonly<Record<BreakpointName, number>> {
  return useContext(ThemeContext)?.breakpoints ?? getBreakpoints();
}

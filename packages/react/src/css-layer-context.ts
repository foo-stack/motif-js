'use client';

import { createContext, useContext } from 'react';

/**
 * The CSS cascade layer every rule Motif emits is wrapped in, set by
 * `<ThemeProvider cssLayer>`. `undefined` means unlayered, which is the
 * default and byte-identical to how Motif has always emitted.
 *
 * Deliberately a **separate context from `ThemeContext`**, not a field on it.
 * `Box` has to read the layer on every render, and `ThemeContext`'s value
 * changes whenever the active theme changes - subscribing `Box` to it would
 * re-render every box in the tree on a theme switch. Switching themes is
 * meant to be an attribute swap that the cascade resolves with no React work
 * at all, and that property is worth preserving.
 *
 * This value is app-level config: it is set once at the root and does not
 * change, so consuming it costs nothing after mount.
 */
export const CssLayerContext = createContext<string | undefined>(undefined);

/**
 * The active cascade layer name, or `undefined` when Motif is unlayered.
 *
 * Read by `Box` to decide both how to emit base style props (inline vs. a
 * class - inline styles cannot belong to a layer) and which layer to wrap
 * injected rules in.
 */
export function useCssLayer(): string | undefined {
  return useContext(CssLayerContext);
}

import type { Theme } from '@usemotif/core';
import { type Context, createContext, useContext } from 'react';

/**
 * Context passed as the optional **second argument** to a fallback-variant
 * function (`'...size': (val, ctx) => …`). It lets the function read raw
 * token values or branch on sibling props — the same expressiveness a
 * token-category spread variant gives you, without leaving the style-prop
 * model: anything returned still flows through the normal token cascade.
 *
 * All fields degrade gracefully: outside a `ThemeProvider`, `theme` and
 * `tokens` are `undefined`, and a fallback that only returns `$`-token refs
 * keeps working untouched.
 */
export interface VariantContext {
  /** The active theme, or `undefined` when rendered outside a ThemeProvider. */
  readonly theme: Theme | undefined;
  /** Shorthand for `theme?.tokens` — the resolved token scales
   * (`colors`, `space`, `sizes`, …). `undefined` outside a ThemeProvider. */
  readonly tokens: Theme['tokens'] | undefined;
  /** The component's incoming props (read-only), for cross-prop logic. */
  readonly props: Readonly<Record<string, unknown>>;
}

/**
 * A styled context carries a set of variant values that flow implicitly from
 * a parent styled component to its descendants — so a `Button`'s `size`
 * reaches its `Text` and `Icon` sub-components without prop threading.
 *
 * Build one with {@link createStyledContext} and hand it to every
 * participating component via `styled(El, { context })`. A `styled` component
 * that names this context both **reads** the inherited values (filling in any
 * variant the caller didn't pass) and **re-provides** the merged result to
 * its subtree.
 *
 * Renderer-agnostic: React context behaves identically on web and native, so
 * this single implementation backs both renderers.
 */
export interface StyledContext<T extends Record<string, unknown>> {
  /** The underlying React context — consumed internally by `styled`. Its
   * value type is intentionally erased to a plain record: React context is
   * invariant in its value type, so a typed `Context<{ size }>` would NOT be
   * assignable to the `StyledContext<Record<string, unknown>>` that
   * `styled()`'s `context` field expects. Erasing it here (while keeping
   * `defaults`/`useStyledContext` strongly typed) makes the assignment work. */
  readonly Context: Context<Record<string, unknown>>;
  /** The context provider. A `styled` component with this `context`
   * re-provides automatically, so you rarely need this directly. */
  readonly Provider: Context<Record<string, unknown>>['Provider'];
  /** Read the current inherited values from a non-`styled` consumer. */
  readonly useStyledContext: () => T;
  /** The default values, used when no provider is above in the tree. */
  readonly defaults: T;
}

/**
 * Create a {@link StyledContext} seeded with `defaults`. Pass the result as
 * the `context` field of every `styled()` component that should share the
 * values:
 *
 * ```tsx
 * const ButtonContext = createStyledContext({ size: 'md' });
 *
 * const Frame = styled('button', {
 *   context: ButtonContext,
 *   variants: { size: { sm: {…}, md: {…}, lg: {…} } },
 *   defaultVariants: { size: 'md' },
 * });
 * const Label = styled('span', {
 *   context: ButtonContext,
 *   variants: { size: { sm: {…}, md: {…}, lg: {…} } },
 * });
 * // <Frame size="lg"><Label>…</Label></Frame> — Label inherits size="lg".
 * ```
 */
export function createStyledContext<T extends Record<string, unknown>>(
  defaults: T,
): StyledContext<T> {
  const Context = createContext<Record<string, unknown>>(defaults);
  return {
    Context,
    Provider: Context.Provider,
    useStyledContext: () => useContext(Context) as T,
    defaults,
  };
}

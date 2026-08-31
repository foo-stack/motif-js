import type { BreakpointName } from '@usemotif/core';

/**
 * Headless-local breakpoint overrides for the viewport-match hook (the engine
 * behind `Adapt`). Pure state - no runtime `@usemotif/core` import, so it
 * doesn't bundle a chunk of core into every headless consumer (the `Record`
 * type below is erased at build).
 *
 * Resolution precedence in `useViewportMatch`, highest first:
 *  1. an explicit pixel `number` passed at the call site (`<Adapt below={800}>`);
 *  2. an override set here via {@link configureViewportBreakpoints};
 *  3. the renderer's live `getBreakpoints()` - which reflects the app's
 *     `<ThemeProvider breakpoints={...}>` / `configureBreakpoints()` config, read
 *     through the `@usemotif/react`(`-native`) peer so it stays in sync without
 *     a second call.
 *
 * So most apps never touch this: configuring breakpoints once on the runtime
 * (step 3) flows through automatically. {@link configureViewportBreakpoints} is
 * the escape hatch for a headless tree that wants different breakpoints from
 * the runtime, or runs without a motif `<ThemeProvider>` at all.
 */
let overrides: Partial<Record<BreakpointName, number>> = {};

/**
 * Override the pixel widths the headless viewport-match uses to resolve
 * breakpoint *names* (`Adapt`/`useViewportMatch` `above`/`below`). Merges over
 * whatever was set before; pass `{}` to clear. Takes precedence over the
 * renderer's configured breakpoints - see the module docstring for the full
 * precedence order. Numbers passed directly to `Adapt` always win regardless.
 */
export function configureViewportBreakpoints(next: Partial<Record<BreakpointName, number>>): void {
  // Merge over prior overrides (per the docstring); an empty object is the
  // documented "clear" signal. The previous `= { ...next }` silently REPLACED,
  // dropping earlier keys and contradicting the "merges" contract - so
  // `configureViewportBreakpoints({ sm: 600 })` then `({ lg: 1200 })` lost `sm`.
  overrides = Object.keys(next).length === 0 ? {} : { ...overrides, ...next };
}

/** The headless-local override for a breakpoint name, or `undefined` if none. */
export function viewportBreakpointOverride(name: BreakpointName): number | undefined {
  return overrides[name];
}

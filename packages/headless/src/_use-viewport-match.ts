'use client';

import type { BreakpointName } from '@usemotif/core';
import { useBreakpointWidths } from '@usemotif/react';
import { useEffect, useState } from 'react';
import { viewportBreakpointOverride } from './_breakpoint-config.js';

const SSR_DEFAULT_WIDTH = 1024;

/**
 * Resolve a breakpoint bound to a pixel width. A `number` is taken literally
 * (the call-site escape hatch); a name resolves through the headless override
 * first, then `widths` - the renderer's per-tree configured set
 * (`useBreakpointWidths()`), which reflects `<ThemeProvider breakpoints>`. See
 * `_breakpoint-config.ts` for the full precedence rationale. Reading the hook
 * from `@usemotif/react` (an externalized peer) keeps `@usemotif/core` out of
 * the headless bundle.
 */
function resolvePx(
  bound: BreakpointName | number,
  widths: Readonly<Record<BreakpointName, number>>,
): number {
  if (typeof bound === 'number') return bound;
  const px = viewportBreakpointOverride(bound) ?? widths[bound];
  // Guarantee a finite number despite the `: number` type: an unknown name or
  // a missing `<ThemeProvider>` peer can yield `undefined`, and `width >=
  // undefined` is always false - which silently disables `<Adapt below="md">`
  // (never adapts to the drawer) with no error. Fall back to the SSR default.
  return Number.isFinite(px) ? (px as number) : SSR_DEFAULT_WIDTH;
}

/**
 * Renderer-agnostic "is the viewport within this band?" hook for the
 * headless layer. Web reads `window.innerWidth` and tracks `resize`; the
 * native variant (`_use-viewport-match.native.tsx`) reads `Dimensions`.
 *
 * `above` / `below` are breakpoint names *or* explicit pixel widths. The
 * result is true when the width is at least `above` AND strictly below
 * `below` - either bound may be omitted. SSR (and the first client render)
 * uses a 1024px default so the server and hydration agree, then the real
 * width applies on mount.
 *
 * This mirrors the private `useViewportMatch` in `@usemotif/react`, but lives
 * here so headless primitives (e.g. `Adapt`) can read the viewport without
 * depending on a renderer package for anything but the breakpoint widths.
 */
export function useViewportMatch(
  above?: BreakpointName | number,
  below?: BreakpointName | number,
): boolean {
  const [width, setWidth] = useState<number>(SSR_DEFAULT_WIDTH);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = (): void => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const widths = useBreakpointWidths();
  const aboveOk = above === undefined || width >= resolvePx(above, widths);
  const belowOk = below === undefined || width < resolvePx(below, widths);
  return aboveOk && belowOk;
}

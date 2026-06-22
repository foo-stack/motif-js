'use client';

import type { BreakpointName } from '@usemotif/core';
import { useEffect, useState } from 'react';

// Inlined so the headless bundle stays free of a runtime `@usemotif/core`
// import (core isn't a headless dependency — pulling it in would bundle a
// chunk of core into every headless consumer). The `BreakpointName` *type* is
// imported (erased at build), so if core's breakpoint set ever changes, the
// `Record<BreakpointName, number>` below fails to typecheck until updated.
const BREAKPOINTS: Record<BreakpointName, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
const SSR_DEFAULT_WIDTH = 1024;

/**
 * Renderer-agnostic "is the viewport within this band?" hook for the
 * headless layer. Web reads `window.innerWidth` and tracks `resize`; the
 * native variant (`_use-viewport-match.native.tsx`) reads `Dimensions`.
 *
 * `above` / `below` are breakpoint names. The result is true when the width
 * is at least `above` AND strictly below `below` — either bound may be
 * omitted. SSR (and the first client render) uses a 1024px default so the
 * server and hydration agree, then the real width applies on mount.
 *
 * This mirrors the private `useViewportMatch` in `@usemotif/react`, but lives
 * here so headless primitives (e.g. `Adapt`) can read the viewport without
 * depending on a renderer package.
 */
export function useViewportMatch(above?: BreakpointName, below?: BreakpointName): boolean {
  const [width, setWidth] = useState<number>(SSR_DEFAULT_WIDTH);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = (): void => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const aboveOk = above === undefined || width >= BREAKPOINTS[above];
  const belowOk = below === undefined || width < BREAKPOINTS[below];
  return aboveOk && belowOk;
}

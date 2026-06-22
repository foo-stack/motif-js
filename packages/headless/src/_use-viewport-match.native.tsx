'use client';

import type { BreakpointName } from '@usemotif/core';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

// Inlined to keep headless free of a runtime `@usemotif/core` import — see the
// web variant for the rationale. The `BreakpointName` type is erased at build.
const BREAKPOINTS: Record<BreakpointName, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Native counterpart to `_use-viewport-match.ts`. Reads the window width from
 * React Native's `Dimensions` and tracks orientation / window changes. Same
 * contract: true when the width is at least `above` AND strictly below
 * `below`, either bound optional.
 */
export function useViewportMatch(above?: BreakpointName, below?: BreakpointName): boolean {
  const [width, setWidth] = useState<number>(() => Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  const aboveOk = above === undefined || width >= BREAKPOINTS[above];
  const belowOk = below === undefined || width < BREAKPOINTS[below];
  return aboveOk && belowOk;
}

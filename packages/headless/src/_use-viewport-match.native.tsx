'use client';

import type { BreakpointName } from '@usemotif/core';
import { getBreakpoints } from '@usemotif/react-native';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { viewportBreakpointOverride } from './_breakpoint-config.js';

/**
 * Resolve a breakpoint bound to a pixel width — see the web variant for the
 * precedence rationale. Reads the renderer's live `getBreakpoints()` from
 * `@usemotif/react-native` (an externalized peer) so the app's runtime
 * breakpoint config flows through without bundling `@usemotif/core`.
 */
function resolvePx(bound: BreakpointName | number): number {
  if (typeof bound === 'number') return bound;
  return viewportBreakpointOverride(bound) ?? getBreakpoints()[bound];
}

/**
 * Native counterpart to `_use-viewport-match.ts`. Reads the window width from
 * React Native's `Dimensions` and tracks orientation / window changes. Same
 * contract: true when the width is at least `above` AND strictly below
 * `below`, either bound optional and either a breakpoint name or pixel width.
 */
export function useViewportMatch(
  above?: BreakpointName | number,
  below?: BreakpointName | number,
): boolean {
  const [width, setWidth] = useState<number>(() => Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  const aboveOk = above === undefined || width >= resolvePx(above);
  const belowOk = below === undefined || width < resolvePx(below);
  return aboveOk && belowOk;
}

'use client';

import { useEffect, useState } from 'react';

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Reports whether the user has asked the system to minimise motion.
 *
 * On the web this tracks the `(prefers-reduced-motion: reduce)` media
 * query and updates live when the OS setting changes. The native
 * implementation (`_use-reduced-motion.native.tsx`) reads
 * `AccessibilityInfo` instead.
 *
 * Headless components use this to skip or shorten enter/exit
 * animations. Export it so consumers supplying their own animation CSS
 * can gate on the same signal.
 *
 * Initial render always returns `false` - the live value is read in an
 * effect - so server and client markup agree and hydration is stable.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const mql = window.matchMedia(REDUCE_MOTION_QUERY);
    setReduced(mql.matches);
    const onChange = (event: MediaQueryListEvent): void => setReduced(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

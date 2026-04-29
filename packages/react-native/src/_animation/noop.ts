import { useEffect, useState } from 'react';
import type { MotionDriver, MotionDriverEntryOptions } from './types.js';

/**
 * No-op driver. Renders `from` for one paint, then drops the overlay —
 * effectively a single-frame "entry animation" with zero interpolation.
 *
 * Used in tests where we don't want a real animation loop, and as the
 * absolute fallback when neither Reanimated nor RN's `Animated` API
 * are usable (e.g. pathological test environments). Production apps
 * never resolve to this driver.
 */
export const noopDriver: MotionDriver = {
  name: 'noop',
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, string | number> | null {
    const [settled, setSettled] = useState(false);
    useEffect(() => {
      setSettled(true);
    }, []);
    return settled ? null : opts.from;
  },
};

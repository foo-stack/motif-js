import { useEffect, useState } from 'react';
import type {
  MotionDriver,
  MotionDriverEntryOptions,
  MotionDriverExitOptions,
  MotionValueDriverBinding,
  MotionValueDriverResult,
} from './types.js';

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
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, string | number> {
    // Single-frame exit: render `from` once, then snap to `to` and
    // signal completion. Tests use this for deterministic exits.
    const [settled, setSettled] = useState(false);
    useEffect(() => {
      setSettled(true);
      opts.onComplete();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return settled ? opts.to : opts.from;
  },
  useMotionValueBacking(bindings: readonly MotionValueDriverBinding[]): MotionValueDriverResult {
    // Snap to each binding's initial value and do not subscribe. Tests
    // that need to observe `.set()` updates should register either the
    // `animatedDriver` or a custom test driver — the noop is the
    // single-frame "render the value once" surface for determinism.
    const overlay: Record<string, unknown> = {};
    for (const b of bindings) {
      overlay[b.cssProperty] = b.mv.get();
    }
    return { overlay };
  },
};

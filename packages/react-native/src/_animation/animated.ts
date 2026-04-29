import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';
import type { MotionDriver, MotionDriverEntryOptions } from './types.js';

/**
 * Default native motion driver — backed by RN's built-in `Animated` API.
 *
 * Mechanics: a single `Animated.Value` drives a 0→1 progress signal.
 * On every value change we interpolate each animatable key from
 * `from[k]` toward `to[k]` and call `setState` with the per-frame
 * overlay. Numeric props interpolate linearly; non-numeric props snap
 * at the midpoint (no real way to interpolate strings frame-by-frame
 * in JS). When progress reaches 1 we return `null` so the overlay
 * disappears and the underlying base style takes over cleanly.
 *
 * Trade-offs: this runs on the JS thread (one setState per frame).
 * It's correct and works without extra deps, but for 60fps-critical
 * surfaces apps should register `reanimatedDriver` instead, which
 * runs the same calculation on the UI thread.
 */
export const animatedDriver: MotionDriver = {
  name: 'animated',
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, string | number> | null {
    const { from, to, durationMs, easing } = opts;
    const progress = useMemo(() => new Animated.Value(0), []);
    const [overlay, setOverlay] = useState<Record<string, string | number> | null>(from);

    useEffect(() => {
      const id = progress.addListener(({ value }: { value: number }) => {
        if (value >= 1) {
          setOverlay(null);
          return;
        }
        setOverlay(interpolateStyles(from, to, value));
      });
      Animated.timing(progress, {
        toValue: 1,
        duration: durationMs,
        easing: mapEasing(easing),
        useNativeDriver: false,
      }).start();
      return () => {
        progress.removeListener(id);
      };
      // The animation runs once on mount — its inputs are the
      // first-render values. Re-running on prop changes mid-flight
      // would jitter the entry. Intentionally fire once.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return overlay;
  },
};

function interpolateStyles(
  from: Record<string, string | number>,
  to: Record<string, string | number>,
  t: number,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, fromValue] of Object.entries(from)) {
    const toValue = to[k];
    if (typeof fromValue === 'number' && typeof toValue === 'number') {
      out[k] = fromValue + (toValue - fromValue) * t;
    } else if (typeof fromValue === 'number' && toValue === undefined) {
      // No corresponding target — fade toward 0 (sensible default for
      // props like `opacity`, `translateX` where 0 is the "neutral"
      // resting value).
      out[k] = fromValue * (1 - t);
    } else {
      // Non-numeric: snap at the midpoint.
      out[k] = t < 0.5 ? fromValue : (toValue ?? fromValue);
    }
  }
  return out;
}

function mapEasing(easing: string): (t: number) => number {
  switch (easing) {
    case 'linear': {
      return Easing.linear;
    }
    case 'ease-in': {
      return Easing.in(Easing.ease);
    }
    case 'ease-out': {
      return Easing.out(Easing.ease);
    }
    case 'ease-in-out': {
      return Easing.inOut(Easing.ease);
    }
    case 'ease': {
      return Easing.ease;
    }
    default: {
      // CSS `cubic-bezier(...)` not natively supported by RN Easing —
      // fall back to the closest standard curve.
      return Easing.inOut(Easing.ease);
    }
  }
}

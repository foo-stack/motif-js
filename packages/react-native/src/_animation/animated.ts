import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Animated, Easing } from 'react-native';
import type {
  MotionDriver,
  MotionDriverEntryOptions,
  MotionDriverExitOptions,
  MotionValueDriverBinding,
  MotionValueDriverResult,
} from './types.js';

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
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, string | number> {
    const { from, to, durationMs, easing, onComplete } = opts;
    const progress = useMemo(() => new Animated.Value(0), []);
    const [overlay, setOverlay] = useState<Record<string, string | number>>(from);

    useEffect(() => {
      let settled = false;
      const id = progress.addListener(({ value }: { value: number }) => {
        if (value >= 1) {
          if (settled) return;
          settled = true;
          // Snap to the final overlay so the last paint matches what
          // the consumer expects to see at completion.
          setOverlay(interpolateStyles(from, to, 1));
          onComplete();
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
      // Fire once on mount; the exit timing is set when the parent
      // boundary flips into 'exiting' phase (which mounts this hook).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return overlay;
  },
  useMotionValueBacking(bindings: readonly MotionValueDriverBinding[]): MotionValueDriverResult {
    // Keep one `Animated.Value` per cssProperty across renders. The Map
    // is keyed by cssProperty (not by MV identity) so a consumer
    // swapping the MV instance on the same prop slot reuses the
    // existing animated node — same visual continuity as if the MV
    // hadn't moved. The trade-off: changing the MV identity discards
    // the JS-side subscriber for the old MV (handled by the cleanup
    // re-running on each render).
    const nodesRef = useRef<Map<string, Animated.Value> | null>(null);
    if (nodesRef.current === null) nodesRef.current = new Map();
    const nodes = nodesRef.current;

    const overlay: Record<string, unknown> = {};
    for (const b of bindings) {
      const initial = b.mv.get();
      // v1 supports numeric motion values only. Animated.Value can't
      // interpolate string values cleanly on the JS thread; skip with
      // a warning. The base style for the prop still applies.
      if (typeof initial !== 'number') {
        // eslint-disable-next-line no-console
        console.warn(
          `[motif] motion value on '${b.cssProperty}' has non-numeric value — ` +
            `the animated driver supports numeric motion values only in v1.`,
        );
        continue;
      }
      let node = nodes.get(b.cssProperty);
      if (node === undefined) {
        node = new Animated.Value(initial);
        nodes.set(b.cssProperty, node);
      }
      overlay[b.cssProperty] = node;
    }

    useEffect(() => {
      const unsubs: Array<() => void> = [];
      for (const b of bindings) {
        const node = nodes.get(b.cssProperty);
        if (node === undefined) continue;
        // Seed in case the MV value changed between hook setup above
        // and the effect firing. `Animated.Value.setValue` does its
        // own Object.is bail-out so a no-op seed is cheap.
        const current = b.mv.get();
        if (typeof current === 'number') node.setValue(current);
        unsubs.push(
          b.mv.on('change', (v) => {
            if (typeof v === 'number') node.setValue(v);
          }),
        );
      }
      return () => {
        for (const u of unsubs) u();
      };
      // bindings array identity changes each render; we resubscribe
      // each render to keep the closures fresh. MV.on/off is O(1) and
      // typical binding counts are tiny.
    });

    return {
      overlay,
      // `Animated.Value` style entries require Animated.View — plain
      // View ignores them entirely.
      Host: Animated.View as unknown as ComponentType<unknown>,
    };
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

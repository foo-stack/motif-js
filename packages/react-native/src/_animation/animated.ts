import { TRANSFORM_AXIS_NAMES, type TransformAxis } from '@usemotif/core';
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Animated, Easing } from 'react-native';
import type {
  MotionDriver,
  MotionDriverEntryOptions,
  MotionDriverExitOptions,
  MotionValueDriverBinding,
  MotionValueDriverResult,
  SpringBackingConfig,
  SpringBackingHandle,
  SpringBackingOptions,
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
    const { from, to, durationMs, easing, delayMs = 0 } = opts;
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
      const kickoff = (): void => {
        Animated.timing(progress, {
          toValue: 1,
          duration: durationMs,
          easing: mapEasing(easing),
          useNativeDriver: false,
        }).start();
      };
      // `<Stack stagger>` populates `delayMs`. Use a JS `setTimeout`
      // rather than `Animated.delay` so the overlay state stays pinned
      // at `from` during the delay window without driving listener
      // updates per frame.
      const timer = delayMs > 0 ? setTimeout(kickoff, delayMs) : null;
      if (timer === null) kickoff();
      return () => {
        progress.removeListener(id);
        if (timer !== null) clearTimeout(timer);
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
    // Keep one `Animated.Value` per node key across renders. Regular
    // bindings key by cssProperty; transform-axis bindings key by
    // axis name (`x`, `rotate`, ...) so each axis gets its own
    // `Animated.Value` even though they share the `transform` slot.
    //
    // Map is keyed by string (not MV identity) so swapping the MV on
    // the same prop reuses the existing animated node — same visual
    // continuity as if the MV hadn't moved.
    const nodesRef = useRef<Map<string, Animated.Value> | null>(null);
    if (nodesRef.current === null) nodesRef.current = new Map();
    const nodes = nodesRef.current;

    const overlay: Record<string, unknown> = {};
    const axisNodes: Partial<Record<TransformAxis, Animated.Value>> = {};
    let hasAxisNode = false;

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

      // Transform-axis bindings live on the `transform` slot; key the
      // node by axis name so each axis gets its own Animated.Value.
      const nodeKey = b.transformAxis ?? b.cssProperty;
      let node = nodes.get(nodeKey);
      if (node === undefined) {
        node = new Animated.Value(initial);
        nodes.set(nodeKey, node);
      }

      if (b.transformAxis !== undefined) {
        axisNodes[b.transformAxis] = node;
        hasAxisNode = true;
      } else {
        overlay[b.cssProperty] = node;
      }
    }

    // Compose transform axes into RN's array form. Each entry maps a
    // single axis-name key to its Animated.Value; the Animated.View
    // host interpolates each one on the JS thread per frame.
    if (hasAxisNode) {
      overlay.transform = TRANSFORM_AXIS_NAMES.flatMap((axis) =>
        buildAxisEntries(axis, axisNodes[axis]),
      );
    }

    useEffect(() => {
      const unsubs: Array<() => void> = [];
      for (const b of bindings) {
        const nodeKey = b.transformAxis ?? b.cssProperty;
        const node = nodes.get(nodeKey);
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
  useSpringBacking(opts: SpringBackingOptions): SpringBackingHandle {
    // `Animated.Value` lives across renders; new() once and persist.
    // `opts.initial` is mount-time data; subsequent prop changes
    // intentionally don't reset the in-flight spring.
    const initialRef = useRef<number>(opts.initial);
    const animValue = useMemo(() => new Animated.Value(initialRef.current), []);
    const subscribersRef = useRef<Set<(value: number) => void>>(new Set());
    const valueRef = useRef<number>(initialRef.current);
    const inFlightRef = useRef<{ stop: () => void } | null>(null);

    useEffect(() => {
      const listenerId = animValue.addListener(({ value }: { value: number }) => {
        valueRef.current = value;
        for (const cb of subscribersRef.current) cb(value);
      });
      return () => {
        animValue.removeListener(listenerId);
        inFlightRef.current?.stop();
        inFlightRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle members forward to refs / the persistent animValue, so the
    // surface stays referentially stable across renders even though we
    // recreate the wrapper object each time.
    return {
      get(): number {
        return valueRef.current;
      },
      setTarget(target: number, config: SpringBackingConfig): void {
        // Cancel any in-flight retarget so velocity carries through the
        // new spring instead of being clobbered. `Animated.spring` reads
        // current velocity from the Animated.Value when not given one.
        inFlightRef.current?.stop();
        const animation = Animated.spring(animValue, {
          toValue: target,
          stiffness: config.stiffness,
          damping: config.damping,
          mass: config.mass,
          restSpeedThreshold: config.restSpeed,
          restDisplacementThreshold: config.restDistance,
          velocity: config.velocity,
          useNativeDriver: false,
        });
        animation.start();
        inFlightRef.current = animation as unknown as { stop: () => void };
      },
      subscribe(cb: (value: number) => void): () => void {
        subscribersRef.current.add(cb);
        return () => {
          subscribersRef.current.delete(cb);
        };
      },
    };
  },
};

/**
 * Build the RN transform-array entries for one axis given its
 * Animated.Value (or `undefined` if the axis isn't bound on this Box).
 *
 * `x`/`y`/`z` map to `translateX/Y/Z`. Rotation and skew axes need a
 * unit suffix (`Ndeg`), but `Animated.Value` is numeric — so the
 * driver interpolates each Animated.Value into a `Ndeg` string via
 * `Animated.Value.interpolate({inputRange, outputRange, …})`. The
 * `skew` shorthand expands to a pair of skewX + skewY entries to
 * match `composeTransformAxesNative`'s policy.
 */
function buildAxisEntries(axis: TransformAxis, node: Animated.Value | undefined): unknown[] {
  if (node === undefined) return [];
  if (axis === 'x') return [{ translateX: node }];
  if (axis === 'y') return [{ translateY: node }];
  if (axis === 'z') return [{ translateZ: node }];
  if (axis === 'scale') return [{ scale: node }];
  if (axis === 'scaleX') return [{ scaleX: node }];
  if (axis === 'scaleY') return [{ scaleY: node }];
  if (axis === 'rotate') return [{ rotate: degStringFromAnim(node) }];
  if (axis === 'rotateX') return [{ rotateX: degStringFromAnim(node) }];
  if (axis === 'rotateY') return [{ rotateY: degStringFromAnim(node) }];
  if (axis === 'rotateZ') return [{ rotateZ: degStringFromAnim(node) }];
  if (axis === 'skew') {
    const s = degStringFromAnim(node);
    return [{ skewX: s }, { skewY: s }];
  }
  if (axis === 'skewX') return [{ skewX: degStringFromAnim(node) }];
  if (axis === 'skewY') return [{ skewY: degStringFromAnim(node) }];
  return [];
}

/**
 * Interpolate a numeric `Animated.Value` into an `Ndeg` string for
 * RN's rotation / skew transform slots. Uses a wide bidirectional
 * input range so the animated value covers every realistic rotation
 * — RN's interpolate extrapolates per `extrapolate: 'extend'` by
 * default, but staying inside an explicit range keeps interpolation
 * cheap and rounding deterministic.
 */
function degStringFromAnim(node: Animated.Value): unknown {
  // The `interpolate` method exists on Animated.Value at runtime; the
  // mock in tests may not implement it, so guard with a fallback that
  // still satisfies the consumer's shape requirement.
  const maybeInterp = (node as unknown as {
    interpolate?: (config: { inputRange: number[]; outputRange: string[] }) => unknown;
  }).interpolate;
  if (typeof maybeInterp === 'function') {
    return maybeInterp.call(node, {
      inputRange: [-360_000, 360_000],
      outputRange: ['-360000deg', '360000deg'],
    });
  }
  return node;
}

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

import { TRANSFORM_AXIS_NAMES, type TransformAxis } from '@usemotif/core';
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Animated, Easing } from 'react-native';
import type {
  ImperativeAnimateControls,
  ImperativeAnimateFn,
  ImperativeAnimateOptions,
  ImperativeAnimateTarget,
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
  useImperativeAnimate(): ImperativeAnimateFn {
    // Per-target × per-property `Animated.Value` cache. Refs are
    // identity-stable across renders so a regular Map keyed by ref is
    // fine; we don't need WeakMap behaviour because the cache itself
    // lives only as long as this hook does.
    const valuesRef = useRef<Map<unknown, Map<string, Animated.Value>>>(new Map());

    const animateFn = useRef<ImperativeAnimateFn | null>(null);
    if (animateFn.current === null) {
      animateFn.current = (target, keyframes, options) => {
        return runImperativeAnimate(valuesRef.current, target, keyframes, options);
      };
    }

    useEffect(() => {
      const cache = valuesRef.current;
      return () => {
        // No explicit cleanup needed for Animated.Value; cancelling
        // the per-call animations is the consumer's job via the
        // returned controls. Leaving values pinned in the map across
        // unmount would leak, but the hook re-runs from scratch on
        // remount and we don't carry these values across. Snapshot
        // the cache reference at effect-setup time so the cleanup
        // closes over a stable identity.
        cache.clear();
      };
    }, []);

    return animateFn.current;
  },
};

/**
 * Per-property fallback starting values when the consumer doesn't
 * supply a `[from, to]` tuple and the property hasn't been animated on
 * this target before. Picked to match the identity values native
 * styles use, so a `{ opacity: 0 }` snap on first call jumps from
 * a likely-correct `1` rather than from `0` (which would be a no-op).
 */
const IMPERATIVE_DEFAULTS: Record<string, number> = {
  opacity: 1,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
};

/**
 * Drive a one-shot imperative animation against a single host View.
 * Each property runs on its own `Animated.Value` interpolated via
 * `Animated.timing`; all properties group into an `Animated.parallel`
 * so the returned controls reflect "all settled" semantics.
 *
 * Per-frame style writes go through `ref.current.setNativeProps`.
 * Selector-string targets resolve to an empty match list on native;
 * returns no-op controls that resolve immediately so cross-platform
 * call sites don't throw on a stringy target.
 */
function runImperativeAnimate(
  cache: Map<unknown, Map<string, Animated.Value>>,
  target: ImperativeAnimateTarget,
  keyframes: Record<string, number | string | readonly [number | string, number | string]>,
  options: ImperativeAnimateOptions | undefined,
): ImperativeAnimateControls {
  if (typeof target === 'string') {
    return resolvedControls();
  }
  const ref = target;
  if (ref.current === null) {
    return resolvedControls();
  }

  const durationMs = (options?.duration ?? 0.3) * 1000;
  const delayMs = (options?.delay ?? 0) * 1000;
  const easing = mapEasing(options?.easing ?? 'ease-in-out');

  let perTarget = cache.get(ref);
  if (perTarget === undefined) {
    perTarget = new Map();
    cache.set(ref, perTarget);
  }

  const animations: Array<{ stop: () => void }> = [];
  const valuesAndKeys: Array<{ key: string; value: Animated.Value }> = [];

  for (const key in keyframes) {
    const entry = keyframes[key];
    let fromValue: number;
    let toValue: number;
    if (Array.isArray(entry)) {
      fromValue = numericOrZero(entry[0]);
      toValue = numericOrZero(entry[1]);
    } else {
      // Single-value form: use cached last value as `from`, falling
      // back to the per-property identity default, or to `toValue`
      // itself (snap on first call when the default is unknown).
      toValue = numericOrZero(entry as number | string);
      const existing = perTarget.get(key);
      if (existing !== undefined) {
        fromValue = readAnimatedValue(existing, toValue);
      } else {
        fromValue = IMPERATIVE_DEFAULTS[key] ?? toValue;
      }
    }

    let av = perTarget.get(key);
    if (av === undefined) {
      av = new Animated.Value(fromValue);
      perTarget.set(key, av);
    } else {
      av.setValue(fromValue);
    }
    valuesAndKeys.push({ key, value: av });

    animations.push(
      Animated.timing(av, {
        toValue,
        duration: durationMs,
        delay: delayMs,
        easing,
        useNativeDriver: false,
      }) as unknown as { stop: () => void },
    );
  }

  // Wire setNativeProps writes: a single listener per Animated.Value
  // builds a merged style object on every tick. Cheap path for a
  // few-prop animation; expensive ones can extend the driver method
  // later.
  const listeners: Array<{ value: Animated.Value; id: string }> = [];
  for (const { key, value } of valuesAndKeys) {
    const id = value.addListener(({ value: v }: { value: number }) => {
      const view = ref.current as {
        setNativeProps?: (p: { style: Record<string, unknown> }) => void;
      };
      view?.setNativeProps?.({ style: { [key]: v } });
    });
    listeners.push({ value, id });
  }

  let settled = false;
  let resolveFn: () => void = () => undefined;
  let rejectFn: (err?: unknown) => void = () => undefined;
  const finished = new Promise<void>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  const parallel = Animated.parallel(animations as unknown as Animated.CompositeAnimation[]);
  parallel.start((result: { finished: boolean }) => {
    if (settled) return;
    settled = true;
    for (const { value, id } of listeners) value.removeListener(id);
    if (result.finished) resolveFn();
    else rejectFn(new Error('cancelled'));
  });

  return {
    finished: finished.catch(() => undefined),
    cancel(): void {
      if (settled) return;
      for (const a of animations) a.stop();
      for (const { value, id } of listeners) value.removeListener(id);
      settled = true;
      rejectFn(new Error('cancelled'));
    },
    pause(): void {
      // RN `Animated` doesn't expose a true pause; stopping the
      // composite halts further updates at the current value, which
      // matches the visible semantic.
      for (const a of animations) a.stop();
    },
    play(): void {
      // Re-issue timing from the current Animated.Value position
      // toward the original target. No-op if already settled.
      if (settled) return;
      const fresh: Array<{ stop: () => void }> = [];
      for (const { key, value } of valuesAndKeys) {
        const entry = keyframes[key]!;
        const to = numericOrZero(Array.isArray(entry) ? entry[1] : (entry as number | string));
        fresh.push(
          Animated.timing(value, {
            toValue: to,
            duration: durationMs,
            easing,
            useNativeDriver: false,
          }) as unknown as { stop: () => void },
        );
      }
      Animated.parallel(fresh as unknown as Animated.CompositeAnimation[]).start(
        ({ finished: ok }: { finished: boolean }) => {
          if (settled) return;
          settled = true;
          if (ok) resolveFn();
          else rejectFn(new Error('cancelled'));
        },
      );
    },
  };
}

function numericOrZero(value: number | string | undefined): number {
  if (typeof value === 'number') return value;
  if (value === undefined) return 0;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function readAnimatedValue(av: Animated.Value, fallback: number): number {
  // `Animated.Value._value` is internal but stable across RN versions
  // we support; the public API has no synchronous read. Falls back
  // gracefully when the field isn't present.
  const internal = (av as unknown as { _value?: number })._value;
  return typeof internal === 'number' ? internal : fallback;
}

function resolvedControls(): ImperativeAnimateControls {
  return {
    finished: Promise.resolve(),
    cancel: () => undefined,
    pause: () => undefined,
    play: () => undefined,
  };
}

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
  const maybeInterp = (
    node as unknown as {
      interpolate?: (config: { inputRange: number[]; outputRange: string[] }) => unknown;
    }
  ).interpolate;
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

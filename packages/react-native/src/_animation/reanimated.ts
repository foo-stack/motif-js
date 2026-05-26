import { composeTransformAxesNative, type TransformAxes } from '@usemotif/core';
import { useEffect, useState, type ComponentType } from 'react';
import type {
  MotionDriver,
  MotionDriverEntryOptions,
  MotionDriverExitOptions,
  MotionValueDriverBinding,
  MotionValueDriverResult,
} from './types.js';

/**
 * Reanimated-backed driver — opt-in.
 *
 * Why opt-in: Reanimated is an optional peer dep. Statically importing
 * it from `@usemotif/react-native`'s entry point would force every
 * native consumer to install it, which we don't want. Apps that have
 * Reanimated installed import this file explicitly and call
 * `registerMotionDriver(reanimatedDriver)` once at startup.
 *
 * Bundle policy: this file is NOT re-exported from the package's
 * top-level `index.ts`. Tree-shaking is irrelevant on React Native
 * (Metro doesn't tree-shake by default), so we rely on path-level
 * code splitting instead — consumers reach this driver only via a
 * direct subpath import.
 *
 * ```tsx
 * import { registerMotionDriver } from '@usemotif/react-native';
 * import { reanimatedDriver } from '@usemotif/react-native/reanimated';
 *
 * registerMotionDriver(reanimatedDriver);
 * ```
 *
 * **UI-thread integration.** When Reanimated is loadable, the driver
 * runs animations through `useSharedValue` + `useAnimatedStyle` and
 * exposes Reanimated's `Animated.View` as `AnimatedHost`. Box then
 * renders that host so `useAnimatedStyle` results actually animate
 * on the UI thread (60fps without main-thread cost — the React
 * tree never re-renders during the animation).
 *
 * **Fallback path.** If Reanimated is registered but not actually
 * importable (peer missing, native module not linked yet), the
 * driver degrades to JS-thread `setState` interpolation — the same
 * shape as the v1 driver, so apps don't hang or crash. They just
 * lose the UI-thread benefit until the peer is properly installed.
 */

interface SharedValue<T> {
  value: T;
}

interface ReanimatedModule {
  readonly default?: { readonly View?: ComponentType<unknown> };
  readonly View?: ComponentType<unknown>;
  readonly useSharedValue?: <T>(initial: T) => SharedValue<T>;
  readonly useAnimatedStyle?: (worklet: () => Record<string, unknown>) => Record<string, unknown>;
  readonly withTiming?: (
    toValue: number,
    config?: { duration?: number; easing?: unknown },
    callback?: (finished: boolean) => void,
  ) => unknown;
  readonly Easing?: Record<string, unknown>;
  readonly runOnJS?: <F extends (...args: unknown[]) => unknown>(fn: F) => F;
}

let cachedModule: ReanimatedModule | null | undefined;

function loadReanimated(): ReanimatedModule | null {
  if (cachedModule !== undefined) return cachedModule;
  try {
    // Dynamic require so the static import graph never references
    // reanimated. Apps without it installed are unaffected.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require('react-native-reanimated') as ReanimatedModule;
  } catch {
    cachedModule = null;
  }
  return cachedModule;
}

/**
 * Resolve Reanimated's `Animated.View` if the peer is loadable.
 * Drivers consume this via the {@link MotionDriver.AnimatedHost} slot;
 * Box renders it instead of plain `View` when motion props are
 * active. When Reanimated isn't loadable this stays `undefined` and
 * Box falls back to plain `View` (the JS-thread fallback path still
 * works because the driver's hook returns plain style records the
 * regular `View` understands).
 */
function resolveAnimatedHost(): ComponentType<unknown> | undefined {
  const r = loadReanimated();
  if (r === null) return undefined;
  return r.default?.View ?? r.View;
}

/**
 * Pick a Reanimated `Easing` function for a CSS-style keyword. Falls
 * back to a permissive `inOut` curve when the keyword isn't known —
 * matches the behaviour of the JS-thread driver and the web
 * fallback in `springToCssTiming`.
 */
function pickEasing(r: ReanimatedModule, easing: string): unknown {
  const e = r.Easing;
  if (e === undefined) return undefined;
  switch (easing) {
    case 'linear':
      return (e['linear'] as () => unknown | undefined)?.();
    case 'ease':
      return (e['ease'] as () => unknown | undefined)?.();
    case 'ease-in':
      return (e['in'] as ((fn: unknown) => unknown) | undefined)?.(e['ease']);
    case 'ease-out':
      return (e['out'] as ((fn: unknown) => unknown) | undefined)?.(e['ease']);
    case 'ease-in-out':
    default:
      return (e['inOut'] as ((fn: unknown) => unknown) | undefined)?.(e['ease']);
  }
}

/**
 * Build a worklet body that interpolates between `from` and `to` at
 * the current shared-value progress. Numeric keys interpolate
 * linearly; non-numeric keys snap at the midpoint (Reanimated has no
 * cross-fade primitive for arbitrary string values).
 *
 * The body MUST start with the `'worklet'` directive — Reanimated's
 * Babel plugin lifts the function body to the UI thread when this
 * directive is present, and degrades to a JS-thread call otherwise.
 */
function makeStyleWorklet(
  from: Record<string, string | number>,
  to: Record<string, string | number>,
  progress: SharedValue<number>,
): () => Record<string, unknown> {
  return function styleWorklet(): Record<string, unknown> {
    'worklet';
    const t = progress.value;
    const out: Record<string, unknown> = {};
    for (const k in from) {
      const fromValue = from[k];
      const toValue = to[k];
      if (typeof fromValue === 'number' && typeof toValue === 'number') {
        out[k] = fromValue + (toValue - fromValue) * t;
      } else if (typeof fromValue === 'number' && toValue === undefined) {
        out[k] = fromValue * (1 - t);
      } else {
        out[k] = t < 0.5 ? fromValue : (toValue ?? fromValue);
      }
    }
    return out;
  };
}

const ANIMATED_HOST = resolveAnimatedHost();

export const reanimatedDriver: MotionDriver = {
  name: 'reanimated',
  AnimatedHost: ANIMATED_HOST,
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, unknown> | null {
    const { from, to, durationMs, easing } = opts;
    const r = loadReanimated();

    // Tease apart the two paths up-front (Rules of Hooks: both
    // branches must call the same hooks in the same order). We always
    // call useState + useEffect; the body inside swaps based on
    // whether the UI-thread integration is wireable.
    const uiThreadAvailable =
      r !== null &&
      r.useSharedValue !== undefined &&
      r.useAnimatedStyle !== undefined &&
      r.withTiming !== undefined;

    const progress = uiThreadAvailable ? r.useSharedValue!(0) : null;

    // JS-thread fallback: setProgress driven by rAF — same shape as
    // the v1 driver so tests / apps without Reanimated still land
    // sensibly when the driver is registered.
    const [jsProgress, setJsProgress] = useState(0);

    useEffect(() => {
      if (uiThreadAvailable && progress !== null) {
        // `withTiming` returns Reanimated's animation handle (an
        // opaque proxy assignable to a SharedValue<number>).
        // TypeScript sees it as `unknown` through our minimal typing
        // surface; cast at the boundary so the rest of the function
        // stays strict.
        progress.value = r.withTiming!(1, {
          duration: durationMs,
          easing: pickEasing(r, easing),
        }) as unknown as number;
        return;
      }
      // Fallback: rAF loop on the JS thread.
      const startedAt = Date.now();
      let cancelled = false;
      const tick = (): void => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const t = Math.min(1, elapsed / durationMs);
        setJsProgress(t);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return () => {
        cancelled = true;
      };
      // Animation runs once on mount. Re-running mid-flight on prop
      // changes would jitter the entry; consumers that want re-trigger
      // semantics should remount the component.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // We unconditionally call useAnimatedStyle even on the fallback
    // path (with a noop worklet) so the hook count stays stable. When
    // we go through the fallback we ignore the return value.
    const animatedStyle = (r?.useAnimatedStyle ?? noopUseAnimatedStyle)(
      uiThreadAvailable && progress !== null
        ? makeStyleWorklet(
            from as Record<string, string | number>,
            to as Record<string, string | number>,
            progress,
          )
        : NOOP_WORKLET,
    );

    if (uiThreadAvailable) return animatedStyle;
    if (jsProgress >= 1) return null;
    return interpolate(from, to, jsProgress);
  },
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, unknown> {
    const { from, to, durationMs, easing, onComplete } = opts;
    const r = loadReanimated();

    const uiThreadAvailable =
      r !== null &&
      r.useSharedValue !== undefined &&
      r.useAnimatedStyle !== undefined &&
      r.withTiming !== undefined;

    const progress = uiThreadAvailable ? r.useSharedValue!(0) : null;
    const [jsProgress, setJsProgress] = useState(0);

    useEffect(() => {
      if (uiThreadAvailable && progress !== null) {
        const finish = (...args: unknown[]): unknown => {
          const finished = args[0] as boolean;
          if (finished) onComplete();
          return undefined;
        };
        // `withTiming`'s completion callback runs on the UI thread; if
        // `runOnJS` is exposed (it is in Reanimated 2+), bounce the
        // user-supplied callback back onto the JS thread to avoid
        // worklet/JS scope confusion.
        const cb = r.runOnJS !== undefined ? r.runOnJS(finish) : finish;
        progress.value = r.withTiming!(
          1,
          { duration: durationMs, easing: pickEasing(r, easing) },
          cb as (finished: boolean) => void,
        ) as unknown as number;
        return;
      }
      const startedAt = Date.now();
      let cancelled = false;
      let signalled = false;
      const tick = (): void => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const t = Math.min(1, elapsed / durationMs);
        setJsProgress(t);
        if (t >= 1) {
          if (!signalled) {
            signalled = true;
            onComplete();
          }
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedStyle = (r?.useAnimatedStyle ?? noopUseAnimatedStyle)(
      uiThreadAvailable && progress !== null
        ? makeStyleWorklet(
            from as Record<string, string | number>,
            to as Record<string, string | number>,
            progress,
          )
        : NOOP_WORKLET,
    );

    if (uiThreadAvailable) return animatedStyle;
    return interpolate(from, to, Math.min(jsProgress, 1));
  },
  useMotionValueBacking(bindings: readonly MotionValueDriverBinding[]): MotionValueDriverResult {
    const r = loadReanimated();
    const uiThreadAvailable =
      r !== null && r.useSharedValue !== undefined && r.useAnimatedStyle !== undefined;

    // Single shared value holding a record keyed by cssProperty. The
    // worklet (UI thread) reads the record verbatim; each binding's
    // JS-thread subscriber mutates one slot by replacing the record
    // reference (Reanimated's deep-compare picks up the change).
    //
    // We always call useSharedValue to keep the hook count stable; on
    // the fallback path the result is unused. Same convention as the
    // existing entry/exit hooks in this driver.
    const sharedRecord = (r?.useSharedValue ?? noopUseSharedValue)<Record<string, number>>(
      buildInitialRecord(bindings),
    );

    // Fallback path: setState-driven record. Used when reanimated is
    // registered but not actually loadable, or when running in test
    // environments without the native module.
    const [jsRecord, setJsRecord] = useState<Record<string, number>>(() =>
      buildInitialRecord(bindings),
    );

    // Track current transform-axis values so the JS-side subscriber can
    // recompose the `transform` array on every axis change. v1 routes
    // axis bindings through the same JS-thread compose path as the
    // default driver; UI-thread transform-axis composition is a
    // separate follow-up (composing in a worklet requires special
    // handling of closure-captured axis order arrays).
    const transformAxesState: TransformAxes = {};
    for (const b of bindings) {
      if (b.transformAxis !== undefined) {
        const v = b.mv.get();
        if (typeof v === 'string' || typeof v === 'number') {
          transformAxesState[b.transformAxis] = v;
        }
      }
    }

    useEffect(() => {
      const unsubs: Array<() => void> = [];
      for (const b of bindings) {
        const initial = b.mv.get();
        if (typeof initial !== 'number') {
          // eslint-disable-next-line no-console
          console.warn(
            `[motif] motion value on '${b.cssProperty}' has non-numeric value — ` +
              `the reanimated driver supports numeric motion values only in v1.`,
          );
          continue;
        }
        unsubs.push(
          b.mv.on('change', (v) => {
            if (typeof v !== 'number') return;
            if (b.transformAxis !== undefined) {
              transformAxesState[b.transformAxis] = v;
              const composed = composeTransformAxesNative(transformAxesState);
              if (uiThreadAvailable) {
                sharedRecord.value = {
                  ...sharedRecord.value,
                  transform: composed as unknown as number,
                };
              } else {
                setJsRecord((prev) => ({
                  ...prev,
                  transform: composed as unknown as number,
                }));
              }
              return;
            }
            if (uiThreadAvailable) {
              // Mutate by replacing the record reference. Reanimated
              // picks up the change because the top-level `.value`
              // identity has changed.
              sharedRecord.value = { ...sharedRecord.value, [b.cssProperty]: v };
            } else {
              setJsRecord((prev) => ({ ...prev, [b.cssProperty]: v }));
            }
          }),
        );
      }
      return () => {
        for (const u of unsubs) u();
      };
    });

    const animatedStyle = (r?.useAnimatedStyle ?? noopUseAnimatedStyle)(
      uiThreadAvailable
        ? function styleWorklet(): Record<string, unknown> {
            'worklet';
            return sharedRecord.value;
          }
        : NOOP_WORKLET,
    );

    if (uiThreadAvailable) {
      // ANIMATED_HOST is undefined when reanimated is registered but
      // didn't expose a `View` (peer mismatch). Plain `View` is the
      // safe fallback there — reanimated's animated style results
      // degrade gracefully when handed to a regular View (no animation,
      // but no crash either).
      return ANIMATED_HOST === undefined
        ? { overlay: animatedStyle }
        : { overlay: animatedStyle, Host: ANIMATED_HOST };
    }
    return { overlay: jsRecord };
  },
};

function buildInitialRecord(bindings: readonly MotionValueDriverBinding[]): Record<string, number> {
  const initial: Record<string, number> = {};
  const transformAxes: TransformAxes = {};
  let sawAxis = false;
  for (const b of bindings) {
    const v = b.mv.get();
    if (b.transformAxis !== undefined) {
      sawAxis = true;
      if (typeof v === 'string' || typeof v === 'number') {
        transformAxes[b.transformAxis] = v;
      }
      continue;
    }
    if (typeof v === 'number') initial[b.cssProperty] = v;
  }
  if (sawAxis) {
    const composed = composeTransformAxesNative(transformAxes);
    if (composed !== undefined) {
      // The shared record's value-type is `Record<string, number>` for
      // simplicity; widening here keeps the typing honest while still
      // landing the composed array under the `transform` key.
      initial.transform = composed as unknown as number;
    }
  }
  return initial;
}

function noopUseSharedValue<T>(initial: T): { value: T } {
  // Returns a fresh shell each render. The fallback path doesn't
  // depend on its identity — it reads from jsRecord instead. Calling
  // a hook here would risk rules-of-hooks violations if the runtime
  // branch ever flipped (it can't, in practice — `loadReanimated()`
  // caches — but the plain factory keeps the contract honest).
  return { value: initial };
}

const NOOP_WORKLET = (): Record<string, unknown> => ({});

function noopUseAnimatedStyle(_worklet: () => Record<string, unknown>): Record<string, unknown> {
  // The fallback path doesn't read this — see consumers above.
  return {};
}

function interpolate(
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
      out[k] = fromValue * (1 - t);
    } else {
      out[k] = t < 0.5 ? fromValue : (toValue ?? fromValue);
    }
  }
  return out;
}

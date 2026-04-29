import { useEffect, useState, type ComponentType } from 'react';
import type { MotionDriver, MotionDriverEntryOptions, MotionDriverExitOptions } from './types.js';

/**
 * Reanimated-backed driver — opt-in.
 *
 * Why opt-in: Reanimated is an optional peer dep. Statically importing
 * it from `@motif-js/react-native`'s entry point would force every
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
 * import { registerMotionDriver } from '@motif-js/react-native';
 * import { reanimatedDriver } from '@motif-js/react-native/reanimated';
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
};

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

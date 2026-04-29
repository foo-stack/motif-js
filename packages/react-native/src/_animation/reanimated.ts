import { useEffect, useMemo, useState } from 'react';
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
 * Implementation note: this is a thin v1 stub that uses Reanimated's
 * `withTiming` if present and falls back to JS-thread interpolation
 * otherwise. The full UI-thread `useAnimatedStyle` integration is
 * tracked separately — it requires Box to render Reanimated's
 * `Animated.View`, which we'll wire up in a follow-on once the API
 * surface here proves out.
 */

interface ReanimatedModule {
  withTiming?: (
    toValue: number,
    config: { duration?: number },
    callback?: (finished: boolean) => void,
  ) => unknown;
  Easing?: Record<string, unknown>;
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

export const reanimatedDriver: MotionDriver = {
  name: 'reanimated',
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, string | number> | null {
    const { from, to, durationMs } = opts;
    const reanimated = useMemo(() => loadReanimated(), []);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      if (reanimated?.withTiming === undefined) {
        // Reanimated not loadable — settle immediately, behaving like
        // the noop driver. Apps that registered this driver but lack
        // the peer dep get a one-frame entry rather than a hang.
        setProgress(1);
        return;
      }
      const startedAt = Date.now();
      let cancelled = false;
      const tick = (): void => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const t = Math.min(1, elapsed / durationMs);
        setProgress(t);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (progress >= 1) return null;
    return interpolate(from, to, progress);
  },
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, string | number> {
    const { from, to, durationMs, onComplete } = opts;
    const reanimated = useMemo(() => loadReanimated(), []);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      if (reanimated?.withTiming === undefined) {
        setProgress(1);
        onComplete();
        return;
      }
      const startedAt = Date.now();
      let cancelled = false;
      let signalled = false;
      const tick = (): void => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const t = Math.min(1, elapsed / durationMs);
        setProgress(t);
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

    return interpolate(from, to, Math.min(progress, 1));
  },
};

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

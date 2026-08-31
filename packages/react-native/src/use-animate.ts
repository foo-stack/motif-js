import { useEffect, useRef, type RefObject } from 'react';
import { getMotionDriver } from './_animation/index.js';
import type { ImperativeAnimateControls } from './_animation/types.js';

/**
 * Native counterpart of `useAnimate`. The web hook drives imperative
 * animations against any element via the Web Animations API; the
 * native hook routes through the active motion driver's
 * `useImperativeAnimate` method.
 *
 * The default `animatedDriver` interpolates each property via an
 * `Animated.Value` and writes the per-frame style through
 * `setNativeProps` on the target view.
 *
 * Targets are ref-only on native (`scope` ref or a ref to a host
 * View). Selector strings - supported on web via
 * `querySelectorAll` - have no native equivalent in v1 and resolve to
 * a no-op (immediately settled controls). Cross-platform code that
 * relies on selector targets should guard with a platform check.
 *
 * When the active driver doesn't implement `useImperativeAnimate`
 * (e.g. a custom test driver), `animate` falls back to documented
 * stub behaviour: resolves immediately and logs a one-time dev
 * warning.
 */

export type AnimationScope = RefObject<unknown>;
export type AnimateTarget = AnimationScope | string;

export interface AnimationOptions {
  /** Duration in seconds. Default `0.3`. */
  duration?: number;
  /** Delay before the animation starts, in seconds. Default `0`. */
  delay?: number;
  /** Easing keyword. Default `'ease-in-out'`. */
  easing?: string;
}

export interface AnimationControls {
  /** Resolves when the animation settles. */
  finished: Promise<void>;
  cancel(): void;
  pause(): void;
  play(): void;
}

export interface AnimateFn {
  (
    target: AnimateTarget,
    keyframes: Record<string, number | string | readonly [number | string, number | string]>,
    options?: AnimationOptions,
  ): AnimationControls;
}

let warned = false;

/**
 * Hook returning `[scope, animate]` for imperative animations.
 *
 * `scope` is a ref you attach to a host View; `animate` runs against
 * any ref handed to it (typically `scope` or another View ref).
 *
 * @example
 * ```tsx
 * const [scope, animate] = useAnimate();
 *
 * async function runIntro() {
 *   await animate(scope, { opacity: 1 }, { duration: 0.3 }).finished;
 *   await animate(rowRef, { opacity: 1, scale: 1 }, { duration: 0.4 }).finished;
 * }
 *
 * return <Box ref={scope}>{children}</Box>;
 * ```
 *
 * @remarks
 * Honour user reduced-motion at the call site - branch on
 * `useReducedMotion()` (from `@usemotif/headless`) and either skip
 * the animation or pass `duration: 0`.
 */
export function useAnimate(): [AnimationScope, AnimateFn] {
  const scope = useRef<unknown>(null);
  const driver = getMotionDriver();
  const driverAnimate = driver.useImperativeAnimate?.();

  const animateFn = useRef<AnimateFn | null>(null);
  const driverAnimateRef = useRef(driverAnimate);
  driverAnimateRef.current = driverAnimate;

  if (animateFn.current === null) {
    animateFn.current = (target, keyframes, options) => {
      const f = driverAnimateRef.current;
      if (f === undefined) {
        // No driver impl - same documented stub as the v1 behaviour.
        if (!warned) {
          warned = true;
          // eslint-disable-next-line no-console
          console.warn(
            '[motif] useAnimate: active driver does not implement useImperativeAnimate. ' +
              'animate() resolves immediately without running.',
          );
        }
        return {
          finished: Promise.resolve(),
          cancel: () => undefined,
          pause: () => undefined,
          play: () => undefined,
        };
      }
      const controls: ImperativeAnimateControls = f(
        target as Parameters<typeof f>[0],
        keyframes,
        options,
      );
      return controls;
    };
  }

  useEffect(() => {
    return () => {
      // Nothing to clean - per-call controls are the consumer's
      // cancellation handle. The driver hook's own cleanup runs on
      // unmount via React's effect-cleanup chain.
    };
  }, []);

  return [scope, animateFn.current];
}

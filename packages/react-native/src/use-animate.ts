import { useRef, type RefObject } from 'react';

/**
 * Native counterpart of `useAnimate`. The web hook uses the Web
 * Animations API to drive imperative animations against any element
 * in scope; RN has no analogous push-model primitive — animations on
 * native flow through the motion-driver registry which is built
 * around per-Box subscription, not external pokes.
 *
 * For v1 the native hook is a documented stub: same shape as the web
 * hook so cross-platform consumer code compiles, but every call logs
 * a dev warning and returns immediately-resolved controls. Proper
 * native imperative animation needs a `useImperativeAnimate`-style
 * driver method (Reanimated `withTiming` / `withSequence` for
 * UI-thread sequences, `Animated.sequence` on the default driver).
 *
 * Cross-platform recommendation for now: use `useSpring` (#34) or
 * `useTransform` (#27) + motion-value-bound props. Both work on
 * native today and cover the most common imperative animation
 * use cases (drag release, scroll-driven hero animations, etc.).
 */

export type AnimationScope = RefObject<unknown>;
export type AnimateTarget = AnimationScope | string;

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface AnimationControls {
  finished: Promise<void>;
  cancel(): void;
  pause(): void;
  play(): void;
}

export interface AnimateFn {
  (
    target: AnimateTarget,
    keyframes: Record<string, string | number>,
    options?: AnimationOptions,
  ): AnimationControls;
}

let warned = false;

/**
 * Stub returning a scope ref and a no-op animate function. Same
 * signature as the web hook so cross-platform code compiles; logs
 * a one-time dev warning when `animate(...)` is called.
 *
 * See `@usemotif/react` for the full web implementation. Native
 * imperative animate is a documented follow-up.
 */
export function useAnimate(): [AnimationScope, AnimateFn] {
  const scope = useRef<unknown>(null);
  const animateFn = useRef<AnimateFn | null>(null);
  if (animateFn.current === null) {
    animateFn.current = (_target, _keyframes, _options) => {
      if (!warned) {
        warned = true;
        // eslint-disable-next-line no-console
        console.warn(
          '[motif] useAnimate is a stub on react-native in v1 — animations resolve ' +
            'immediately without running. For native imperative animation, drive ' +
            'props via useSpring / useTransform on motion-value-bound style props.',
        );
      }
      return {
        finished: Promise.resolve(),
        cancel: () => undefined,
        pause: () => undefined,
        play: () => undefined,
      };
    };
  }
  return [scope, animateFn.current];
}

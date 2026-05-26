import { useRef, type RefObject } from 'react';

/** Mirrors the web hook's option shape. */
export type LayoutAnimationKind = 'all' | 'position' | 'size';

export interface UseLayoutAnimationOptions {
  kind?: LayoutAnimationKind;
  duration?: number;
  easing?: string;
}

let warned = false;

/**
 * Native counterpart of `useLayoutAnimation`. v1 ships as a documented
 * stub.
 *
 * FLIP on web reads `getBoundingClientRect()` synchronously inside
 * `useLayoutEffect`, applies an inverse transform, and animates back
 * to identity. RN has no synchronous measurement primitive — `onLayout`
 * fires after layout, and `measure()` is async-callback-based.
 * Routing through the motion-driver registry (Reanimated's
 * `useAnimatedReaction` worklet, or Animated.timing on the default
 * driver) is the right v1.next path.
 *
 * For now the ref still gets attached so cross-platform consumer code
 * compiles. A one-time dev warning fires on first use to surface the
 * limitation; the layout change snaps without animation.
 *
 * Cross-platform workaround today: animate explicit dimensions /
 * positions through motion-value-bound style props on `Box` (e.g.
 * `useSpring` + `width={spring}`). The FLIP pattern remains web-only
 * in v1.
 */
export function useLayoutAnimation<T = unknown>(
  _options: UseLayoutAnimationOptions = {},
): RefObject<T | null> {
  if (!warned) {
    warned = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[motif] useLayoutAnimation is a stub on react-native in v1 — layout changes ' +
        'snap without animation. Native FLIP via measure + motion-driver is a follow-up.',
    );
  }
  return useRef<T | null>(null);
}

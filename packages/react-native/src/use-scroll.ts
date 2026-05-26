import { createMotionValue, type MotionValue } from '@usemotif/core';
import { useEffect, useState, type RefObject } from 'react';
import type { MotifScrollViewRef } from './scroll.js';

/**
 * Options for {@link useScroll}.
 *
 * On native there is no window scroll — every scroll source is a
 * specific `ScrollView`. The `container` ref is **required**; pass a
 * `useRef<MotifScrollViewRef>(null)` and hand the same ref to the
 * motif `<ScrollView ref={ref}>` you want to track.
 *
 * The `target`-relative form (progress as a specific element enters /
 * exits the viewport, with offset strings) is not part of this v1
 * surface; it lands in a follow-up.
 */
export interface UseScrollOptions {
  /** Ref to a motif `<ScrollView>` to track. Required on native. */
  container: RefObject<MotifScrollViewRef | null>;
}

/**
 * Motion values returned by {@link useScroll}. All four are
 * {@link MotionValue}s — feed them to `useTransform` to derive
 * animated style without triggering React renders. `*Progress` values
 * are `0..1` ratios of the scroll position relative to the maximum
 * scrollable distance on each axis; when the container is not
 * scrollable on an axis, that axis' progress stays at `0`.
 */
export interface UseScrollResult {
  scrollX: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollXProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Track scroll position of a motif `<ScrollView>` as motion values
 * that bypass React renders.
 *
 * @example
 * ```tsx
 * function ParallaxList() {
 *   const ref = useRef<MotifScrollViewRef>(null);
 *   const { scrollYProgress } = useScroll({ container: ref });
 *   const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
 *   return (
 *     <ScrollView ref={ref}>
 *       <Box opacity={opacity}>fades out as you scroll</Box>
 *     </ScrollView>
 *   );
 * }
 * ```
 *
 * @remarks
 * Subscribes to the publisher exposed via the ScrollView's ref. The
 * ScrollView batches scroll events at `scrollEventThrottle={16}` by
 * default (≈60fps); raise or lower that prop on the consuming
 * `<ScrollView>` if a different cadence is needed.
 *
 * Respect user reduced-motion preference at the consumer site
 * (`useReducedMotion()` branch) — `useScroll` does not gate itself.
 */
export function useScroll(options: UseScrollOptions): UseScrollResult {
  const containerRef = options.container;

  const [values] = useState<UseScrollResult>(() => ({
    scrollX: createMotionValue(0),
    scrollY: createMotionValue(0),
    scrollXProgress: createMotionValue(0),
    scrollYProgress: createMotionValue(0),
  }));

  useEffect(() => {
    const handle = containerRef.current;
    // Defensive: if the consumer wires the ref but the ScrollView
    // hasn't mounted yet, bail. v1 doesn't re-subscribe on later
    // mount (the ref-current mutation isn't observable here); the
    // ScrollView must be mounted before this effect runs.
    if (handle === null) return undefined;
    const publisher = handle.__publisher;

    const apply = (): void => {
      const s = publisher.getState();
      const maxX = Math.max(0, s.contentWidth - s.layoutWidth);
      const maxY = Math.max(0, s.contentHeight - s.layoutHeight);
      values.scrollX.set(s.scrollX);
      values.scrollY.set(s.scrollY);
      values.scrollXProgress.set(maxX === 0 ? 0 : s.scrollX / maxX);
      values.scrollYProgress.set(maxY === 0 ? 0 : s.scrollY / maxY);
    };

    // Seed initial values from the publisher's current snapshot.
    apply();

    return publisher.subscribe(apply);
  }, [containerRef, values]);

  return values;
}

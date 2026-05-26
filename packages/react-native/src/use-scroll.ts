import {
  computeTargetScrollProgress,
  createMotionValue,
  parseScrollOffset,
  type MotionValue,
  type ScrollOffsetPair,
} from '@usemotif/core';
import { useEffect, useRef, useState, type RefObject } from 'react';
import type { LayoutChangeEvent, View } from 'react-native';
import type { MotifScrollViewRef } from './scroll.js';

/**
 * Handle returned by {@link useScrollTarget}. The consumer spreads
 * `{ ref, onLayout }` onto a `<Box>` or `<View>` inside the tracked
 * `<ScrollView>`; `useScroll` then reads from the layout snapshot
 * stashed on the handle to compute target-relative progress.
 *
 * On native there is no synchronous `getBoundingClientRect` equivalent,
 * so the layout snapshot is the cheap way to make `useScroll`'s
 * per-tick progress computation O(1) without hopping the UI thread.
 */
export interface ScrollTargetHandle {
  /** Spread onto the tracked element. */
  readonly ref: RefObject<View | null>;
  /** Spread onto the tracked element. */
  readonly onLayout: (event: LayoutChangeEvent) => void;
  /**
   * Internal — current layout snapshot of the tracked element
   * (content-space coordinates within the parent `<ScrollView>`).
   * Updated by `onLayout`. `useScroll` reads from here on each
   * scroll-publisher tick.
   *
   * @internal
   */
  readonly __layout: RefObject<{ x: number; y: number; width: number; height: number } | null>;
}

/**
 * Capture the layout of a `<Box>` / `<View>` so {@link useScroll} can
 * compute its scroll-relative progress. Returns `{ ref, onLayout }` to
 * spread onto the tracked element.
 *
 * @example
 * ```tsx
 * const target = useScrollTarget();
 * const { scrollYProgress } = useScroll({ container: scrollRef, target });
 *
 * <ScrollView ref={scrollRef}>
 *   …
 *   <Box ref={target.ref} onLayout={target.onLayout}>tracked</Box>
 *   …
 * </ScrollView>
 * ```
 */
export function useScrollTarget(): ScrollTargetHandle {
  const ref = useRef<View | null>(null);
  const layout = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  // Stable handle across renders — ref / onLayout identities don't
  // change, so consumers that destructure once at mount aren't surprised
  // by a fresh layout snapshot leaking new function identities.
  const handleRef = useRef<ScrollTargetHandle | null>(null);
  if (handleRef.current === null) {
    handleRef.current = {
      ref,
      onLayout: (event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        layout.current = { x, y, width, height };
      },
      __layout: layout,
    };
  }
  return handleRef.current;
}

/**
 * Options for {@link useScroll} on native.
 *
 * `container` is required (there is no window-level scroll on native).
 * Pass `target` (a {@link ScrollTargetHandle} from {@link useScrollTarget})
 * to switch to target-relative progress; without it, the hook reports
 * scroll progress over the maximum scrollable distance.
 */
export interface UseScrollOptions {
  /** Ref to a motif `<ScrollView>` to track. Required on native. */
  container: RefObject<MotifScrollViewRef | null>;
  /**
   * Target element whose scroll-relative progress is tracked. Get
   * the handle from {@link useScrollTarget} and spread its `ref` /
   * `onLayout` onto the tracked element.
   */
  target?: ScrollTargetHandle;
  /**
   * Pair of `<element-edge> <viewport-edge>` anchors. Used only when
   * `target` is set. Default `['start end', 'end start']`.
   */
  offset?: ScrollOffsetPair;
}

/**
 * Motion values returned by {@link useScroll}. All four are
 * {@link MotionValue}s. With `target`, the progress values run between
 * the two `offset` anchors; without, they report position over the
 * maximum scrollable distance.
 */
export interface UseScrollResult {
  scrollX: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollXProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

const DEFAULT_OFFSET: ScrollOffsetPair = ['start end', 'end start'];

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
 * @example
 * ```tsx
 * function ScrollReveal() {
 *   const scrollRef = useRef<MotifScrollViewRef>(null);
 *   const target = useScrollTarget();
 *   const { scrollYProgress } = useScroll({ container: scrollRef, target });
 *   const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
 *   return (
 *     <ScrollView ref={scrollRef}>
 *       <Box ref={target.ref} onLayout={target.onLayout} opacity={opacity}>
 *         fades in on entry
 *       </Box>
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
 */
export function useScroll(options: UseScrollOptions): UseScrollResult {
  const containerRef = options.container;
  const target = options.target;
  const offset = options.offset ?? DEFAULT_OFFSET;

  const [values] = useState<UseScrollResult>(() => ({
    scrollX: createMotionValue(0),
    scrollY: createMotionValue(0),
    scrollXProgress: createMotionValue(0),
    scrollYProgress: createMotionValue(0),
  }));

  useEffect(() => {
    const handle = containerRef.current;
    if (handle === null) return undefined;
    const publisher = handle.__publisher;
    const offsets = parseScrollOffset(offset);

    const apply = (): void => {
      const s = publisher.getState();
      values.scrollX.set(s.scrollX);
      values.scrollY.set(s.scrollY);

      if (target !== undefined) {
        const layout = target.__layout.current;
        if (layout === null) {
          // Layout hasn't fired yet — leave progress at its last value
          // rather than snapping to 0. Once layout arrives a subsequent
          // publisher tick will refresh.
          return;
        }
        values.scrollXProgress.set(
          computeTargetScrollProgress(layout.x, layout.width, s.scrollX, s.layoutWidth, offsets),
        );
        values.scrollYProgress.set(
          computeTargetScrollProgress(layout.y, layout.height, s.scrollY, s.layoutHeight, offsets),
        );
        return;
      }

      const maxX = Math.max(0, s.contentWidth - s.layoutWidth);
      const maxY = Math.max(0, s.contentHeight - s.layoutHeight);
      values.scrollXProgress.set(maxX === 0 ? 0 : s.scrollX / maxX);
      values.scrollYProgress.set(maxY === 0 ? 0 : s.scrollY / maxY);
    };

    apply();
    return publisher.subscribe(apply);
  }, [containerRef, target, offset, values]);

  return values;
}

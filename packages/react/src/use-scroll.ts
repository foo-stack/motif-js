'use client';

import { createMotionValue, type MotionValue } from '@usemotif/core';
import { useEffect, useState, type RefObject } from 'react';

/**
 * Options for {@link useScroll}.
 *
 * Default (no options) tracks window scroll. Pass `container` to track
 * scroll inside a specific element instead — any element with an
 * overflow scroll context.
 *
 * The `target`-relative form (progress as a specific element enters /
 * exits the viewport, with `offset: ['start end', 'end start']` edge
 * strings) is not part of this v1 surface; it lands in a follow-up.
 */
export interface UseScrollOptions {
  /**
   * Ref to the scroll container element. When provided, scroll values
   * are derived from this element's `scrollLeft` / `scrollTop`. When
   * omitted, the window is the scroll source.
   *
   * The ref must be populated by the time `useScroll`'s effect runs —
   * mount the element in a child component (parent effects fire after
   * child mounts, so `ref.current` is set before the listener attaches).
   * Conditionally mounting the container after first render is not
   * supported in v1; the hook subscribes once and does not re-bind on
   * ref-current mutation.
   */
  container?: RefObject<HTMLElement | null>;
}

/**
 * Motion values returned by {@link useScroll}.
 *
 * All four are {@link MotionValue}s — feed them to {@link useTransform}
 * to derive opacity, translate, scale, etc. without triggering React
 * renders. `*Progress` values are `0..1` ratios of the scroll position
 * relative to the maximum scrollable distance on each axis; when the
 * container is not scrollable on an axis, that axis' progress stays at
 * `0`.
 */
export interface UseScrollResult {
  scrollX: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollXProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Track scroll position as motion values that bypass React renders.
 *
 * Without options, listens to `window` scroll. Pass `container: ref` to
 * listen to a specific scroll container instead.
 *
 * @example
 * ```tsx
 * function ParallaxHero() {
 *   const { scrollYProgress } = useScroll();
 *   const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
 *   return <Box style={{ transform: `translateY(${y.get()}px)` }} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ScrollContainer() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { scrollYProgress } = useScroll({ container: ref });
 *   return (
 *     <div ref={ref} style={{ overflow: 'auto', height: 400 }}>
 *       …long content…
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * Scroll events are coalesced via `requestAnimationFrame`, so the
 * motion values update at most once per frame. The listener is
 * registered with `passive: true` and won't block scrolling.
 *
 * Respect user reduced-motion preference at the consumer site
 * (`useReducedMotion()` branch) — `useScroll` does not gate itself.
 */
export function useScroll(options?: UseScrollOptions): UseScrollResult {
  const containerRef = options?.container;

  const [values] = useState<UseScrollResult>(() => ({
    scrollX: createMotionValue(0),
    scrollY: createMotionValue(0),
    scrollXProgress: createMotionValue(0),
    scrollYProgress: createMotionValue(0),
  }));

  useEffect(() => {
    // SSR / non-DOM environments: do nothing. (The hook still creates
    // motion values above so consumer code that reads `.get()` from
    // them stays well-typed.)
    if (typeof window === 'undefined') return undefined;

    const target = containerRef?.current ?? null;
    let rafId: number | null = null;

    const measure = (): void => {
      rafId = null;
      if (target !== null) {
        const maxX = Math.max(0, target.scrollWidth - target.clientWidth);
        const maxY = Math.max(0, target.scrollHeight - target.clientHeight);
        values.scrollX.set(target.scrollLeft);
        values.scrollY.set(target.scrollTop);
        values.scrollXProgress.set(maxX === 0 ? 0 : target.scrollLeft / maxX);
        values.scrollYProgress.set(maxY === 0 ? 0 : target.scrollTop / maxY);
      } else {
        const docEl = document.documentElement;
        const sx = window.scrollX;
        const sy = window.scrollY;
        const maxX = Math.max(0, docEl.scrollWidth - window.innerWidth);
        const maxY = Math.max(0, docEl.scrollHeight - window.innerHeight);
        values.scrollX.set(sx);
        values.scrollY.set(sy);
        values.scrollXProgress.set(maxX === 0 ? 0 : sx / maxX);
        values.scrollYProgress.set(maxY === 0 ? 0 : sy / maxY);
      }
    };

    const onScroll = (): void => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(measure);
    };

    // Seed initial values so consumers see the current scroll state
    // immediately on mount (not just after the first scroll event).
    measure();

    const eventTarget: EventTarget = target ?? window;
    eventTarget.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      eventTarget.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [containerRef, values]);

  return values;
}

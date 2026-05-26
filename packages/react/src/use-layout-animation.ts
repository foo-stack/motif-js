'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * What to animate when the element's layout changes. `'all'` (default)
 * animates both position and size; `'position'` ignores width / height
 * changes; `'size'` ignores translation. Matches framer-motion's
 * `layout` prop values.
 */
export type LayoutAnimationKind = 'all' | 'position' | 'size';

/** Options for {@link useLayoutAnimation}. */
export interface UseLayoutAnimationOptions {
  /** Which axes to animate. Default `'all'`. */
  kind?: LayoutAnimationKind;
  /** Transition duration in seconds. Default `0.3`. */
  duration?: number;
  /** CSS easing function. Default `'ease-in-out'`. */
  easing?: string;
}

interface RectSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Animate an element between its previous and next layout box (FLIP).
 *
 * On every commit, the hook reads the element's `getBoundingClientRect`
 * inside `useLayoutEffect` (runs after the DOM updates but before
 * paint). If the rect differs from the previous commit's, the hook
 * applies an inverse transform synchronously — the element stays
 * visually where it was — then schedules a `requestAnimationFrame`
 * tick that clears the transform under a CSS transition, animating
 * to the real position.
 *
 * Attach the returned ref to a real DOM element. The hook is purely
 * imperative (no state changes, no re-renders); the only side effects
 * are inline-style writes to the target element.
 *
 * @example
 * ```tsx
 * function ResizingPanel() {
 *   const ref = useLayoutAnimation();
 *   const [expanded, setExpanded] = useState(false);
 *   return (
 *     <div ref={ref} style={{ height: expanded ? 200 : 80 }}>
 *       …
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Records `getBoundingClientRect()` from `useLayoutEffect`; the
 *   measurement happens after layout but before paint.
 * - Applies `transform: translate(dx, dy) scale(sx, sy)` and an
 *   accompanying `transformOrigin: 0 0` so the inverse delta lands
 *   exactly at the previous position.
 * - The CSS transition is composed inline: `transition: transform
 *   <duration>s <easing>`. The element's existing transition (if any)
 *   is replaced for the duration of the layout animation and restored
 *   when the animation settles.
 * - `useLayoutAnimation` is web-only (relies on synchronous DOM
 *   measurement). The native counterpart in `@usemotif/react-native`
 *   ships as a documented stub until measure + driver integration
 *   lands as a follow-up.
 *
 * Reduced-motion: gate at the consumer site. When the user prefers
 * reduced motion, skip the hook entirely (or pass `duration: 0`).
 */
export function useLayoutAnimation<T extends HTMLElement = HTMLElement>(
  options: UseLayoutAnimationOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const lastRectRef = useRef<RectSnapshot | null>(null);
  const optsRef = useRef<UseLayoutAnimationOptions>(options);
  optsRef.current = options;

  useLayoutEffect(() => {
    const el = ref.current;
    if (el === null) return;

    const next = readRect(el);
    const prev = lastRectRef.current;
    lastRectRef.current = next;

    // First measurement — nothing to animate against.
    if (prev === null) return;

    const opts = optsRef.current;
    const kind = opts.kind ?? 'all';
    const dx = kind === 'size' ? 0 : prev.x - next.x;
    const dy = kind === 'size' ? 0 : prev.y - next.y;
    const sx = kind === 'position' ? 1 : prev.width === 0 ? 1 : prev.width / Math.max(1, next.width);
    const sy =
      kind === 'position' ? 1 : prev.height === 0 ? 1 : prev.height / Math.max(1, next.height);

    // If nothing changed, skip the work — common when a parent
    // re-renders without affecting this element's box.
    if (dx === 0 && dy === 0 && sx === 1 && sy === 1) return;

    // Apply the inverse transform synchronously. Store the original
    // transform / transition / transformOrigin so we can restore them
    // when the animation settles.
    const origTransform = el.style.transform;
    const origTransition = el.style.transition;
    const origTransformOrigin = el.style.transformOrigin;

    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    el.style.transformOrigin = '0 0';
    el.style.transition = 'none';

    const durationMs = (opts.duration ?? 0.3) * 1000;
    const easing = opts.easing ?? 'ease-in-out';

    const rafId = requestAnimationFrame(() => {
      // Force a style flush by reading offsetWidth, then transition
      // the transform back to identity.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetWidth;
      el.style.transition = `transform ${durationMs}ms ${easing}`;
      el.style.transform = '';

      const onEnd = (e: TransitionEvent): void => {
        if (e.propertyName !== 'transform') return;
        el.style.transition = origTransition;
        el.style.transform = origTransform;
        el.style.transformOrigin = origTransformOrigin;
        el.removeEventListener('transitionend', onEnd);
      };
      el.addEventListener('transitionend', onEnd);
    });

    return () => cancelAnimationFrame(rafId);
  });

  return ref;
}

function readRect(el: HTMLElement): RectSnapshot {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

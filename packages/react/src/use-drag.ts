'use client';

import { createMotionValue, type MotionValue } from '@usemotif/core';
import { useEffect, useRef, useState } from 'react';

/**
 * Axis filter for {@link useDrag}. `'x'` and `'y'` lock movement to
 * the horizontal or vertical axis; the other axis stays pinned to its
 * starting position. Omit (or pass `'both'`) to allow free 2D drag.
 */
export type DragAxis = 'x' | 'y' | 'both';

/**
 * Drag-constraint bounds in pixels relative to the drag start. Each
 * bound is optional — omitted bounds are unconstrained on that side.
 *
 * `left` / `right` are negative / positive offsets on the X axis;
 * `top` / `bottom` are negative / positive offsets on the Y axis.
 * Constraints clamp the offset at every move event before it's
 * written to the motion values, so consumers reading `x` / `y` always
 * see in-bounds values.
 */
export interface DragConstraints {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

/** Snapshot of the drag state passed to lifecycle callbacks. */
export interface DragInfo {
  /** Current offset from the drag-start position (clamped to constraints). */
  readonly offset: { readonly x: number; readonly y: number };
  /** Pixel-per-second velocity at the moment of the callback. Computed
   * from the last two pointer samples; zero before the first move. */
  readonly velocity: { readonly x: number; readonly y: number };
}

/** Options for {@link useDrag}. */
export interface UseDragOptions {
  /** Lock the drag to a single axis. Default `'both'` (free 2D drag). */
  axis?: DragAxis;
  /** Bounds for the drag offset. See {@link DragConstraints}. */
  constraints?: DragConstraints;
  /** Fires once on pointer-down (or equivalent). */
  onDragStart?: (info: DragInfo) => void;
  /** Fires on every move event during a drag. */
  onDrag?: (info: DragInfo) => void;
  /** Fires once on pointer-up / cancel. */
  onDragEnd?: (info: DragInfo) => void;
}

/**
 * Result returned by {@link useDrag}. Spread `dragProps` onto a `Box`
 * (or any element accepting `onPointerDown`). The `x` / `y` motion
 * values track the drag offset and compose with `useTransform`,
 * `useSpring`, and the rest of the motion-value surface.
 */
export interface UseDragResult {
  /** Spread onto the draggable element to wire up pointer handlers. */
  readonly dragProps: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  };
  /** Horizontal offset from drag start (in pixels). Pinned at 0 when
   *  `axis === 'y'`. */
  readonly x: MotionValue<number>;
  /** Vertical offset from drag start (in pixels). Pinned at 0 when
   *  `axis === 'x'`. */
  readonly y: MotionValue<number>;
  /** True while a drag is in flight (between pointer-down and
   *  pointer-up / cancel). */
  readonly isDragging: boolean;
}

/**
 * Pointer-event-driven drag gesture.
 *
 * Returns motion values for the drag offset plus a `dragProps` bag to
 * spread on the draggable element. Composes with the existing motion-
 * value surface — feed `x` / `y` into `useTransform` to derive
 * rotation, opacity, etc. from drag position without per-frame
 * `setState`.
 *
 * @example
 * ```tsx
 * const { dragProps, x, y } = useDrag({
 *   constraints: { left: -100, right: 100 },
 *   onDragEnd: ({ offset }) => console.log('settled at', offset),
 * });
 * return <Box {...dragProps} x={x} y={y}>drag me</Box>;
 * ```
 *
 * @remarks
 * Uses `setPointerCapture` so the drag continues tracking outside
 * the element bounds. Lifecycle callbacks (`onDragStart`, `onDrag`,
 * `onDragEnd`) receive a snapshot of the current offset + velocity.
 *
 * Momentum / elastic / spring-settle-on-release are out of scope for
 * v1 — pair with `useSpring` at the consumer site if you want a
 * spring release: `useSpring(0).set(0)` on `onDragEnd`.
 *
 * Honour reduced-motion at the consumer level when drag drives
 * decorative motion; the gesture itself is a direct manipulation and
 * doesn't gate on reduced-motion preferences.
 */
export function useDrag(options: UseDragOptions = {}): UseDragResult {
  const axis = options.axis ?? 'both';

  // Stash options in a ref so callbacks invoked from pointer handlers
  // see the latest closures without forcing re-subscription. The
  // pointer-handlers themselves are stable for the component's
  // lifetime so spreading `dragProps` doesn't churn child renders.
  const optsRef = useRef<UseDragOptions>(options);
  optsRef.current = options;

  const [values] = useState<{ x: MotionValue<number>; y: MotionValue<number> }>(() => ({
    x: createMotionValue(0),
    y: createMotionValue(0),
  }));

  const [isDragging, setIsDragging] = useState(false);

  // Per-drag mutable state. Held in a ref so the pointer-event closures
  // mutate it across events without depending on stale render values.
  const stateRef = useRef<{
    pointerId: number | null;
    startClientX: number;
    startClientY: number;
    lastClientX: number;
    lastClientY: number;
    lastTimeMs: number;
    velocityX: number;
    velocityY: number;
    capturedEl: HTMLElement | null;
  }>({
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    lastClientX: 0,
    lastClientY: 0,
    lastTimeMs: 0,
    velocityX: 0,
    velocityY: 0,
    capturedEl: null,
  });

  const handlersRef = useRef<{
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: (event: PointerEvent) => void;
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  } | null>(null);

  if (handlersRef.current === null) {
    const computeOffset = (): { x: number; y: number } => {
      const s = stateRef.current;
      let dx = s.lastClientX - s.startClientX;
      let dy = s.lastClientY - s.startClientY;
      const cur = optsRef.current.axis ?? 'both';
      if (cur === 'x') dy = 0;
      if (cur === 'y') dx = 0;
      const c = optsRef.current.constraints;
      if (c !== undefined) {
        if (c.left !== undefined && dx < c.left) dx = c.left;
        if (c.right !== undefined && dx > c.right) dx = c.right;
        if (c.top !== undefined && dy < c.top) dy = c.top;
        if (c.bottom !== undefined && dy > c.bottom) dy = c.bottom;
      }
      return { x: dx, y: dy };
    };

    const info = (): DragInfo => {
      const s = stateRef.current;
      return {
        offset: computeOffset(),
        velocity: { x: s.velocityX, y: s.velocityY },
      };
    };

    const onPointerMove = (event: PointerEvent): void => {
      const s = stateRef.current;
      if (event.pointerId !== s.pointerId) return;
      const now =
        typeof performance !== 'undefined' && typeof performance.now === 'function'
          ? performance.now()
          : Date.now();
      const dt = Math.max(1, now - s.lastTimeMs);
      s.velocityX = ((event.clientX - s.lastClientX) / dt) * 1000;
      s.velocityY = ((event.clientY - s.lastClientY) / dt) * 1000;
      s.lastClientX = event.clientX;
      s.lastClientY = event.clientY;
      s.lastTimeMs = now;
      const off = computeOffset();
      values.x.set(off.x);
      values.y.set(off.y);
      optsRef.current.onDrag?.(info());
    };

    const finishDrag = (event: PointerEvent): void => {
      const s = stateRef.current;
      if (event.pointerId !== s.pointerId) return;
      const captured = s.capturedEl;
      if (captured !== null) {
        try {
          captured.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore — pointer may have been released already.
        }
        captured.removeEventListener('pointermove', onPointerMove);
        captured.removeEventListener('pointerup', onPointerUp);
        captured.removeEventListener('pointercancel', onPointerCancel);
      }
      s.pointerId = null;
      s.capturedEl = null;
      optsRef.current.onDragEnd?.(info());
      setIsDragging(false);
    };

    const onPointerUp = (event: PointerEvent): void => {
      finishDrag(event);
    };

    const onPointerCancel = (event: PointerEvent): void => {
      finishDrag(event);
    };

    const onPointerDown = (event: React.PointerEvent<HTMLElement>): void => {
      const s = stateRef.current;
      if (s.pointerId !== null) return; // already dragging
      const el = event.currentTarget;
      s.pointerId = event.pointerId;
      s.startClientX = event.clientX;
      s.startClientY = event.clientY;
      s.lastClientX = event.clientX;
      s.lastClientY = event.clientY;
      s.lastTimeMs =
        typeof performance !== 'undefined' && typeof performance.now === 'function'
          ? performance.now()
          : Date.now();
      s.velocityX = 0;
      s.velocityY = 0;
      s.capturedEl = el;
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        // Some environments (older jsdom, very old Safari) don't
        // implement pointer capture. Drag still works via move/up
        // events on the element itself; we just lose tracking outside
        // its bounds.
      }
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerCancel);
      setIsDragging(true);
      optsRef.current.onDragStart?.(info());
    };

    handlersRef.current = { onPointerMove, onPointerUp, onPointerCancel, onPointerDown };
  }

  // Cleanup on unmount: if a drag is mid-flight, drop the listeners
  // and release any captured pointer so the document doesn't keep
  // routing events to a dead component.
  useEffect(
    () => () => {
      const s = stateRef.current;
      const h = handlersRef.current;
      if (s.pointerId !== null && s.capturedEl !== null && h !== null) {
        try {
          s.capturedEl.releasePointerCapture(s.pointerId);
        } catch {
          // ignore
        }
        s.capturedEl.removeEventListener('pointermove', h.onPointerMove);
        s.capturedEl.removeEventListener('pointerup', h.onPointerUp);
        s.capturedEl.removeEventListener('pointercancel', h.onPointerCancel);
      }
    },
    [],
  );

  // Suppress the no-unused-vars warning for `axis` — the axis filter
  // is read inside `computeOffset` via `optsRef.current.axis` rather
  // than the destructured local, so the local exists only for
  // readability of the hook signature.
  void axis;

  return {
    dragProps: {
      onPointerDown: handlersRef.current.onPointerDown,
    },
    x: values.x,
    y: values.y,
    isDragging,
  };
}

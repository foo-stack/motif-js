import { createMotionValue, type MotionValue } from '@usemotif/core';
import { useEffect, useRef, useState } from 'react';
import { PanResponder } from 'react-native';

/** Axis filter for {@link useDrag}. See web counterpart for semantics. */
export type DragAxis = 'x' | 'y' | 'both';

/** Drag-constraint bounds in DIPs. See web counterpart. */
export interface DragConstraints {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

/** Snapshot of the drag state passed to lifecycle callbacks. */
export interface DragInfo {
  readonly offset: { readonly x: number; readonly y: number };
  readonly velocity: { readonly x: number; readonly y: number };
}

/** Options for {@link useDrag}. */
export interface UseDragOptions {
  axis?: DragAxis;
  constraints?: DragConstraints;
  onDragStart?: (info: DragInfo) => void;
  onDrag?: (info: DragInfo) => void;
  onDragEnd?: (info: DragInfo) => void;
}

/**
 * Result returned by {@link useDrag} on native. `dragProps` is the
 * panHandlers object that React Native's `View` consumes — spread it
 * directly onto the target Box (the panHandlers shape includes
 * `onStartShouldSetResponder`, `onMoveShouldSetResponder`, the
 * grant / move / release callbacks, and the terminate handler — all
 * standard RN responder system fields).
 */
export interface UseDragResult {
  readonly dragProps: Record<string, unknown>;
  readonly x: MotionValue<number>;
  readonly y: MotionValue<number>;
  readonly isDragging: boolean;
}

/**
 * PanResponder-driven drag gesture for React Native.
 *
 * Mirror of the web `useDrag` — same options, same return shape
 * conceptually, but the dragProps bag is RN's panHandlers (spread on
 * a View / Box) instead of pointer-event handlers.
 *
 * @example
 * ```tsx
 * const { dragProps, x, y } = useDrag({
 *   constraints: { left: -100, right: 100 },
 *   onDragEnd: ({ velocity }) => console.log('release velocity', velocity),
 * });
 * return <Box {...dragProps} x={x} y={y}>drag me</Box>;
 * ```
 *
 * @remarks
 * Default driver routes through RN's PanResponder on the JS thread.
 * Reanimated / gesture-handler-backed drag on the UI thread is a
 * follow-up; for v1 the JS-thread integrator is correct and works
 * everywhere.
 */
export function useDrag(options: UseDragOptions = {}): UseDragResult {
  const axis = options.axis ?? 'both';

  const optsRef = useRef<UseDragOptions>(options);
  optsRef.current = options;

  const [values] = useState<{ x: MotionValue<number>; y: MotionValue<number> }>(() => ({
    x: createMotionValue(0),
    y: createMotionValue(0),
  }));

  const [isDragging, setIsDragging] = useState(false);

  const stateRef = useRef<{
    lastDx: number;
    lastDy: number;
    velocityX: number;
    velocityY: number;
  }>({
    lastDx: 0,
    lastDy: 0,
    velocityX: 0,
    velocityY: 0,
  });

  const clamp = (dx: number, dy: number): { x: number; y: number } => {
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
      offset: clamp(s.lastDx, s.lastDy),
      velocity: { x: s.velocityX, y: s.velocityY },
    };
  };

  // PanResponder is created once per mount. Capturing `optsRef` / state
  // refs in the handlers means we can safely keep them around for
  // the component's lifetime without going stale. The created
  // responder's actual return type (`PanResponderInstance`) is a
  // structural superset of our typed slot — cast at the boundary.
  const responderRef = useRef<{ panHandlers: Record<string, unknown> } | null>(null);
  if (responderRef.current === null) {
    responderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        stateRef.current.lastDx = 0;
        stateRef.current.lastDy = 0;
        stateRef.current.velocityX = 0;
        stateRef.current.velocityY = 0;
        setIsDragging(true);
        optsRef.current.onDragStart?.(info());
      },
      onPanResponderMove: (
        _evt: unknown,
        gestureState: { dx: number; dy: number; vx: number; vy: number },
      ) => {
        stateRef.current.lastDx = gestureState.dx;
        stateRef.current.lastDy = gestureState.dy;
        // RN's gesture state ships velocity in DIPs/ms; scale to /s
        // for parity with the web hook.
        stateRef.current.velocityX = gestureState.vx * 1000;
        stateRef.current.velocityY = gestureState.vy * 1000;
        const off = clamp(gestureState.dx, gestureState.dy);
        values.x.set(off.x);
        values.y.set(off.y);
        optsRef.current.onDrag?.(info());
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        optsRef.current.onDragEnd?.(info());
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        optsRef.current.onDragEnd?.(info());
      },
    }) as unknown as { panHandlers: Record<string, unknown> };
  }
  const responder = responderRef.current;

  // Cleanup on unmount — RN doesn't expose a "release responder"
  // primitive from outside the responder system; the View unmount
  // tears down the responder graph naturally. The effect is here so
  // future cleanup hooks (gesture-handler subscriptions, etc.) have
  // a slot.
  useEffect(() => () => undefined, []);

  // `axis` is read via optsRef in clamp(); local exists for hook-
  // signature readability.
  void axis;

  return {
    dragProps: responder.panHandlers,
    x: values.x,
    y: values.y,
    isDragging,
  };
}

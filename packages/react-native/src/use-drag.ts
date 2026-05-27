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

/** Spring config for the post-release momentum animation. */
export interface DragSpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  restSpeed?: number;
  restDistance?: number;
}

/** Options for {@link useDrag}. */
export interface UseDragOptions {
  axis?: DragAxis;
  constraints?: DragConstraints;
  /**
   * Rubber-band elasticity past {@link constraints}. `0` (default)
   * clamps hard at bounds; `1` lets the value extend freely. Values
   * between scale the over-the-bound portion linearly — the iOS-style
   * over-scroll feel.
   *
   * Has no effect when {@link constraints} is omitted.
   */
  dragElastic?: number;
  /**
   * When `true`, the released value continues with velocity-driven
   * inertia and settles via a spring back into {@link constraints}.
   * When `false` (default), the value stops at its release position.
   */
  dragMomentum?: boolean;
  /**
   * Spring config for the post-release settle. Only used when
   * {@link dragMomentum} is true or the released value is outside
   * {@link constraints} (overshoot from {@link dragElastic}).
   */
  dragTransition?: DragSpringConfig;
  onDragStart?: (info: DragInfo) => void;
  onDrag?: (info: DragInfo) => void;
  /** Fires before the post-release momentum settle. */
  onDragEnd?: (info: DragInfo) => void;
}

/**
 * Result returned by {@link useDrag} on native. `dragProps` is the
 * panHandlers object that React Native's `View` consumes — spread it
 * directly onto the target Box.
 */
export interface UseDragResult {
  readonly dragProps: Record<string, unknown>;
  readonly x: MotionValue<number>;
  readonly y: MotionValue<number>;
  readonly isDragging: boolean;
}

const DEFAULT_SPRING: Required<DragSpringConfig> = {
  stiffness: 200,
  damping: 25,
  mass: 1,
  restSpeed: 0.1,
  restDistance: 0.1,
};

const MAX_DT_S = 0.064;
const MOMENTUM_PROJECTION_S = 0.05;

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
 *   dragElastic: 0.5,
 *   dragMomentum: true,
 * });
 * return <Box {...dragProps} x={x} y={y}>drag me</Box>;
 * ```
 *
 * @remarks
 * Default driver routes through RN's PanResponder on the JS thread.
 * Reanimated / gesture-handler-backed drag on the UI thread is a
 * follow-up.
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
    settleRafId: number | null;
  }>({
    lastDx: 0,
    lastDy: 0,
    velocityX: 0,
    velocityY: 0,
    settleRafId: null,
  });

  const applyConstraints = (dx: number, dy: number): { x: number; y: number } => {
    const cur = optsRef.current.axis ?? 'both';
    if (cur === 'x') dy = 0;
    if (cur === 'y') dx = 0;
    const c = optsRef.current.constraints;
    if (c === undefined) return { x: dx, y: dy };
    const elastic = Math.min(1, Math.max(0, optsRef.current.dragElastic ?? 0));
    const rubberX = (raw: number, lo: number | undefined, hi: number | undefined): number => {
      if (lo !== undefined && raw < lo) return lo + (raw - lo) * elastic;
      if (hi !== undefined && raw > hi) return hi + (raw - hi) * elastic;
      return raw;
    };
    return {
      x: rubberX(dx, c.left, c.right),
      y: rubberX(dy, c.top, c.bottom),
    };
  };

  const info = (): DragInfo => {
    const s = stateRef.current;
    return {
      offset: applyConstraints(s.lastDx, s.lastDy),
      velocity: { x: s.velocityX, y: s.velocityY },
    };
  };

  const startSettle = (): void => {
    const opts = optsRef.current;
    const c = opts.constraints;
    const wantsMomentum = opts.dragMomentum === true;
    const wantsElasticReturn =
      c !== undefined &&
      (opts.dragElastic ?? 0) > 0 &&
      isOutOfBounds(values.x.get(), values.y.get(), c);
    if (!wantsMomentum && !wantsElasticReturn) return;

    const cfg = (
      opts.dragTransition === undefined
        ? DEFAULT_SPRING
        : { ...DEFAULT_SPRING, ...opts.dragTransition }
    ) as Required<DragSpringConfig>;

    const projectAndClamp = (
      v: number,
      velocity: number,
      lo: number | undefined,
      hi: number | undefined,
    ): number => {
      let target = v;
      if (wantsMomentum) target = v + velocity * MOMENTUM_PROJECTION_S;
      if (lo !== undefined && target < lo) target = lo;
      if (hi !== undefined && target > hi) target = hi;
      return target;
    };
    const targetX = projectAndClamp(
      values.x.get(),
      stateRef.current.velocityX,
      c?.left,
      c?.right,
    );
    const targetY = projectAndClamp(
      values.y.get(),
      stateRef.current.velocityY,
      c?.top,
      c?.bottom,
    );

    let valueX = values.x.get();
    let valueY = values.y.get();
    let velX = stateRef.current.velocityX;
    let velY = stateRef.current.velocityY;
    let lastTime = nowMs();

    const step = (now: number): void => {
      const dt = Math.min((now - lastTime) / 1000, MAX_DT_S);
      lastTime = now;

      const forceX = -cfg.stiffness * (valueX - targetX) - cfg.damping * velX;
      velX += (forceX / cfg.mass) * dt;
      valueX += velX * dt;

      const forceY = -cfg.stiffness * (valueY - targetY) - cfg.damping * velY;
      velY += (forceY / cfg.mass) * dt;
      valueY += velY * dt;

      const restedX =
        Math.abs(velX) < cfg.restSpeed && Math.abs(valueX - targetX) < cfg.restDistance;
      const restedY =
        Math.abs(velY) < cfg.restSpeed && Math.abs(valueY - targetY) < cfg.restDistance;

      if (restedX && restedY) {
        stateRef.current.settleRafId = null;
        values.x.set(targetX);
        values.y.set(targetY);
        return;
      }
      values.x.set(valueX);
      values.y.set(valueY);
      stateRef.current.settleRafId = requestAnimationFrame(step);
    };
    stateRef.current.settleRafId = requestAnimationFrame(step);
  };

  // PanResponder is created once per mount.
  const responderRef = useRef<{ panHandlers: Record<string, unknown> } | null>(null);
  if (responderRef.current === null) {
    responderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Cancel any in-flight settle so a fresh grab takes over cleanly.
        const s = stateRef.current;
        if (s.settleRafId !== null) {
          cancelAnimationFrame(s.settleRafId);
          s.settleRafId = null;
        }
        s.lastDx = 0;
        s.lastDy = 0;
        s.velocityX = 0;
        s.velocityY = 0;
        setIsDragging(true);
        optsRef.current.onDragStart?.(info());
      },
      onPanResponderMove: (
        _evt: unknown,
        gestureState: { dx: number; dy: number; vx: number; vy: number },
      ) => {
        stateRef.current.lastDx = gestureState.dx;
        stateRef.current.lastDy = gestureState.dy;
        stateRef.current.velocityX = gestureState.vx * 1000;
        stateRef.current.velocityY = gestureState.vy * 1000;
        const off = applyConstraints(gestureState.dx, gestureState.dy);
        values.x.set(off.x);
        values.y.set(off.y);
        optsRef.current.onDrag?.(info());
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        optsRef.current.onDragEnd?.(info());
        startSettle();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        optsRef.current.onDragEnd?.(info());
        startSettle();
      },
    }) as unknown as { panHandlers: Record<string, unknown> };
  }
  const responder = responderRef.current;

  useEffect(
    () => () => {
      const s = stateRef.current;
      if (s.settleRafId !== null) {
        cancelAnimationFrame(s.settleRafId);
        s.settleRafId = null;
      }
    },
    [],
  );

  void axis;

  return {
    dragProps: responder.panHandlers,
    x: values.x,
    y: values.y,
    isDragging,
  };
}

function nowMs(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function isOutOfBounds(x: number, y: number, c: DragConstraints): boolean {
  if (c.left !== undefined && x < c.left) return true;
  if (c.right !== undefined && x > c.right) return true;
  if (c.top !== undefined && y < c.top) return true;
  if (c.bottom !== undefined && y > c.bottom) return true;
  return false;
}

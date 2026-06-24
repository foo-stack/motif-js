'use client';

import { resolveStylesToVars, type MotionStyleBag } from '@usemotif/core';
import {
  createElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from 'react';
import { getMotionDriver, usePresence, type WebMotionDriver } from './_animation/index.js';

/** Stable empty overlay for the inert (no-exitStyle) path. */
const EMPTY_OVERLAY: Record<string, string | number> = {};

/**
 * Wire the active driver's exit hook to an element through the presence
 * context. When a parent `useExitPresence` boundary is in its `'exiting'` phase
 * and `exitStyle` is set, this resolves the exit overlay, registers a pending
 * exit with the boundary, and hands the driver the element to play the leave;
 * the driver's completion settles the registration (so the boundary unmounts).
 *
 * Inert when there's no presence boundary (phase is always `'open'`), no
 * `exitStyle`, or the phase isn't `'exiting'` — so non-exit call sites pay only
 * a handful of cheap, no-op hooks. With the CSS driver `driver.useExit` is a
 * no-op and exit keeps riding the cascade.
 */
export function useDriverExit(
  ref: RefObject<HTMLElement | null>,
  exitStyle: MotionStyleBag | undefined,
  driver: WebMotionDriver,
): void {
  const presence = usePresence();
  // Only imperative drivers (WAAPI `needsRef`) register + drive exit through the
  // presence context. With the CSS driver, exit stays on the boundary's
  // cascade + transitionend/fallback route — so a CSS Box never leaves a
  // pending registration the boundary would have to wait out.
  const exiting =
    exitStyle !== undefined && driver.needsRef === true && presence.phase === 'exiting';

  // The exit "to" overlay — the inline values the element animates toward. As
  // with the enter overlay, `resolveStylesToVars` drops any `transition` (the
  // driver reads timing from the element's resolved transition).
  const to = useMemo(
    () =>
      exitStyle !== undefined
        ? resolveStylesToVars(exitStyle as Record<string, unknown>).style
        : EMPTY_OVERLAY,
    [exitStyle],
  );

  // Register the pending exit when entering the exiting phase; hold the
  // boundary's complete callback so the driver's settle can fire it. This
  // effect is ordered BEFORE the driver's own exit effect (it's called first),
  // so the callback is in place before the driver can settle synchronously
  // (reduced-motion / no-WAAPI fast paths call onComplete during their effect).
  const completeRef = useRef<(() => void) | null>(null);
  useLayoutEffect(() => {
    if (!exiting) {
      completeRef.current = null;
      return undefined;
    }
    completeRef.current = presence.registerExit();
    // On interruption (re-shown mid-exit) or unmount, drop the registration so
    // a late driver settle can't unmount a re-opened element.
    return () => {
      completeRef.current = null;
    };
  }, [exiting, presence]);

  const onComplete = useCallback(() => {
    const done = completeRef.current;
    completeRef.current = null;
    done?.();
  }, []);

  driver.useExit(ref, { to, active: exiting, onComplete });
}

export interface BoxWithExitProps {
  readonly as: ElementType;
  readonly passThrough: Record<string, unknown>;
  readonly finalClassName: string | undefined;
  readonly baseStyle: Record<string, string | number>;
  readonly inlineStyle: CSSProperties | undefined;
  readonly exitStyle: MotionStyleBag;
  readonly children?: ReactNode;
}

/**
 * Exit-only imperative path: a Box that has `exitStyle` but no `enterStyle`,
 * under an imperative driver (WAAPI). Box only dispatches here when the active
 * driver `needsRef` — the CSS driver leaves exit to the cascade and never
 * reaches this component, so the default path stays byte-identical.
 */
export function BoxWithExit(props: BoxWithExitProps) {
  const { as, passThrough, finalClassName, baseStyle, inlineStyle, exitStyle, children } = props;
  const ref = useRef<HTMLElement | null>(null);
  const driver = getMotionDriver();
  useDriverExit(ref, exitStyle, driver);

  const elementProps: Record<string, unknown> = {
    ...passThrough,
    className: finalClassName,
    style: { ...baseStyle, ...inlineStyle } as CSSProperties,
  };
  if (driver.needsRef === true) {
    elementProps.ref = ref;
  }
  return createElement(as, elementProps, children);
}

'use client';

import { PresenceContext, type PresenceContextValue } from '@usemotif/react';
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useReducedMotion } from './_use-reduced-motion.js';

/**
 * Possible motion phases for an element managed by an exit-aware boundary.
 *
 * - `'closed'` — element should not be rendered.
 * - `'entering'` — element just mounted; reserved for future symmetry with
 *   `enterStyle` orchestration.
 * - `'open'` — element is steady-state open.
 * - `'exiting'` — `open` flipped to `false` but the element is still rendered so
 *   its exit can play: with the CSS driver the consumer sets
 *   `data-motif-state="exiting"` and motif's `exitStyle` rule + `transitionend`
 *   drive it; with the off-thread WAAPI driver a descendant `<Box exitStyle>`
 *   reads the phase through the provided `PresenceContext`, registers its exit,
 *   and the driver settles it. The boundary unmounts once every registered exit
 *   completes, a `transitionend` fires, or the fallback timer expires —
 *   whichever comes first.
 */
export type MotionPhase = 'closed' | 'entering' | 'open' | 'exiting';

export interface UseExitTransitionResult {
  /** True while the element should be rendered (`open` or `exiting`). */
  readonly shouldRender: boolean;
  /** Current motion phase. */
  readonly phase: MotionPhase;
  /**
   * Ref to attach to the element whose `transitionend` event signals the exit
   * is complete (the CSS-driver route). Optional — the fallback timer and
   * registered-exit completions also settle the unmount.
   */
  readonly elementRef: React.RefObject<HTMLElement | null>;
  /**
   * Boundary component to wrap exit-aware children in. Publishes the
   * `PresenceContext` so a descendant `<Box exitStyle>` driven by an imperative
   * driver (WAAPI) can register its off-thread exit and settle the unmount
   * precisely when it finishes.
   */
  readonly ExitBoundary: (props: { children: ReactNode }) => ReactElement;
}

/**
 * Delays unmount until the element's exit finishes. When `open` flips
 * `true` → `false` the element stays rendered in the `'exiting'` phase, and the
 * boundary settles to `'closed'` on the FIRST of:
 *  - every descendant that called `registerExit` (via the provided
 *    `ExitBoundary`/`PresenceContext`) signalling completion — the off-thread
 *    WAAPI route, which settles exactly when the animation's `finished` resolves;
 *  - a `transitionend` on the attached element or a descendant — the CSS route;
 *  - the `fallbackDurationMs` timer (default 400ms) — the backstop.
 *
 * Reduced motion (or `fallbackDurationMs <= 0`) skips the exit phase and
 * unmounts synchronously.
 *
 * Dialog-based overlays (Dialog/Modal/Drawer/AlertDialog) consume this; wrapping
 * their content in `ExitBoundary` is what lets a WAAPI-driven descendant surface
 * animate out off the main thread.
 */
export function useExitTransition(
  open: boolean,
  fallbackDurationMs = 400,
): UseExitTransitionResult {
  const [phase, setPhase] = useState<MotionPhase>(open ? 'open' : 'closed');
  const elementRef = useRef<HTMLElement | null>(null);
  const previousOpenRef = useRef<boolean>(open);
  const reducedMotion = useReducedMotion();
  const pendingExits = useRef<Set<symbol>>(new Set());
  const settledRef = useRef<boolean>(false);

  // Settle the exit to `'closed'`. Idempotent for a given exit window; the
  // transitionend, fallback-timer, and registered-exit routes all funnel here.
  const settle = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    pendingExits.current.clear();
    setPhase('closed');
  }, []);

  const registerExit = useCallback((): (() => void) => {
    if (phase !== 'exiting') return () => {};
    const id = Symbol('motif-pending-exit');
    pendingExits.current.add(id);
    let signalled = false;
    return () => {
      if (signalled) return;
      signalled = true;
      pendingExits.current.delete(id);
      if (pendingExits.current.size === 0) settle();
    };
  }, [phase, settle]);

  useEffect(() => {
    const wasOpen = previousOpenRef.current;
    previousOpenRef.current = open;

    if (open && !wasOpen) {
      pendingExits.current.clear();
      settledRef.current = false;
      setPhase('open');
      return undefined;
    }
    if (!open && wasOpen) {
      // No exit window (or reduced motion) — unmount synchronously.
      if (fallbackDurationMs <= 0 || reducedMotion) {
        pendingExits.current.clear();
        settledRef.current = true;
        setPhase('closed');
        return undefined;
      }
      pendingExits.current.clear();
      settledRef.current = false;
      setPhase('exiting');
      const el = elementRef.current;
      const cleanups: Array<() => void> = [];
      if (el !== null) {
        const onEnd = (event: TransitionEvent): void => {
          // Accept the transition on the element itself OR a descendant — the
          // documented CSS usage puts `exitStyle` on a child `<Box>`, so the
          // event bubbles up with `target === child`.
          const target = event.target as Node | null;
          if (target !== el && (target === null || !el.contains(target))) return;
          settle();
        };
        el.addEventListener('transitionend', onEnd);
        cleanups.push(() => el.removeEventListener('transitionend', onEnd));
      }
      const id = setTimeout(settle, fallbackDurationMs);
      cleanups.push(() => clearTimeout(id));
      return () => {
        for (const fn of cleanups) fn();
      };
    }
    // Steady state — sync phase to `open`.
    setPhase(open ? 'open' : 'closed');
    return undefined;
  }, [open, fallbackDurationMs, reducedMotion, settle]);

  // PresenceContext value descendants read. Stable identity per phase/registerExit
  // pair so consumers don't rebind on unrelated re-renders.
  const value = useMemo<PresenceContextValue>(
    () => ({ phase, registerExit }),
    [phase, registerExit],
  );
  const valueRef = useRef(value);
  valueRef.current = value;

  // The boundary reads the latest value through a ref so its own identity stays
  // stable — keying it on `value` would swap the component type each phase flip,
  // tearing down + recreating the subtree (wiping descendant state / replaying
  // entry animations). Phase changes reach descendants through the Provider.
  const ExitBoundary = useCallback(
    ({ children }: { children: ReactNode }): ReactElement =>
      createElement(PresenceContext.Provider, { value: valueRef.current }, children),
    [],
  );

  return {
    shouldRender: phase === 'open' || phase === 'exiting' || phase === 'entering',
    phase,
    elementRef,
    ExitBoundary,
  };
}

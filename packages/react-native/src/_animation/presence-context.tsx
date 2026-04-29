'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * Motion phases for an element managed by an exit-aware presence
 * boundary. Mirrors the web hook in
 * `@motif-js/headless/src/_use-exit-transition.ts`:
 *
 * - `'closed'` — the element should not be rendered.
 * - `'entering'` — reserved for future symmetry with `enterStyle`
 *   orchestration (currently unused on native).
 * - `'open'` — steady-state open.
 * - `'exiting'` — `open` flipped to `false` but the subtree is still
 *   rendered so the descendant `<Box exitStyle={...}>` can interpolate
 *   to the exit overlay before the parent unmounts.
 */
export type MotionPhase = 'closed' | 'entering' | 'open' | 'exiting';

/**
 * Context value descendants read to discover the current motion phase
 * and register a "pending exit" with the parent boundary.
 *
 * On the **web** the equivalent runs through the CSS cascade — the
 * parent toggles `data-motif-state="exiting"` and motif-emitted
 * `[data-motif-state="exiting"]` rules apply to descendants. Native
 * has no cascade, so we plumb the same signal through React context
 * instead.
 */
export interface PresenceContextValue {
  readonly phase: MotionPhase;
  /**
   * Register a pending exit at this descendant. Returns a callback
   * the descendant calls when its exit animation settles. The parent
   * boundary settles to `'closed'` when every registered exit calls
   * its complete callback OR the fallback timer fires (whichever
   * happens first). Calling outside the `'exiting'` phase returns a
   * no-op callback.
   */
  registerExit(): () => void;
}

/**
 * Default context value when no parent presence boundary is in scope.
 * Phase is always `'open'`; `registerExit` is a no-op so descendants
 * pay zero overhead in the common case (no exit animation requested).
 */
const STANDALONE_PRESENCE: PresenceContextValue = {
  phase: 'open',
  registerExit: () => () => {},
};

export const PresenceContext = createContext<PresenceContextValue | null>(null);

/** Read the active presence-context value, falling back to standalone. */
export function usePresence(): PresenceContextValue {
  return useContext(PresenceContext) ?? STANDALONE_PRESENCE;
}

/** Result returned by {@link useExitTransitionNative}. */
export interface UseExitTransitionNativeResult {
  /** True while the subtree should render (`'open'` or `'exiting'`). */
  readonly shouldRender: boolean;
  /** Current motion phase. */
  readonly phase: MotionPhase;
  /**
   * Boundary component to wrap exit-aware children in. Provides the
   * `PresenceContext` so descendants like `<Box exitStyle={...}>` see
   * the current phase and can register their pending exit animations.
   */
  readonly ExitBoundary: (props: { children: ReactNode }) => ReactElement;
}

/**
 * Native equivalent of `@motif-js/headless`'s `useExitTransition` —
 * delays unmount until either every descendant exit animation
 * settles via `registerExit`'s complete callback OR the
 * `fallbackDurationMs` timer fires (whichever comes first).
 *
 * Web's exit machinery uses the CSS cascade + `transitionend` events
 * to let the browser drive the timing. Native has neither, so the
 * same orchestration runs through React context instead — descendants
 * register a pending exit and call back when their driver settles.
 *
 * Pass `fallbackDurationMs <= 0` to skip the exit phase entirely
 * (matches the pre-T1.2 instant-unmount behaviour for callers that
 * don't want exit animations).
 *
 * ```tsx
 * function MyDialog({ open, onClose, children }) {
 *   const { shouldRender, ExitBoundary } = useExitTransitionNative(open);
 *   if (!shouldRender) return null;
 *   return (
 *     <Modal visible={shouldRender} onRequestClose={onClose}>
 *       <ExitBoundary>
 *         <Box exitStyle={{ opacity: 0 }} transition={{ duration: '200ms' }}>
 *           {children}
 *         </Box>
 *       </ExitBoundary>
 *     </Modal>
 *   );
 * }
 * ```
 */
export function useExitTransitionNative(
  open: boolean,
  fallbackDurationMs = 400,
): UseExitTransitionNativeResult {
  const [phase, setPhase] = useState<MotionPhase>(open ? 'open' : 'closed');
  const previousOpenRef = useRef<boolean>(open);
  const pendingExits = useRef<Set<symbol>>(new Set());
  const settledRef = useRef<boolean>(false);

  // Settle the exit phase to `'closed'`. Idempotent; first caller
  // wins. Both descendant-completion and fallback-timer routes funnel
  // through here.
  const settle = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    pendingExits.current.clear();
    setPhase('closed');
  }, []);

  const registerExit = useCallback((): (() => void) => {
    // No exits to register outside the exiting phase. Returning a
    // no-op keeps the descendant's call-site shape uniform.
    if (phase !== 'exiting') return () => {};
    const id = Symbol('motif-pending-exit');
    pendingExits.current.add(id);
    let signalled = false;
    return () => {
      if (signalled) return;
      signalled = true;
      pendingExits.current.delete(id);
      // Settle as soon as the last pending exit completes — a single
      // exit animation that's faster than the fallback shouldn't be
      // padded out to the timer.
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
      // Closing without an exit window — flip straight to closed,
      // matching the pre-T1.2 instant-unmount path for callers that
      // don't want any exit animation.
      if (fallbackDurationMs <= 0) {
        settle();
        return undefined;
      }
      pendingExits.current.clear();
      settledRef.current = false;
      setPhase('exiting');
      const timeoutId = setTimeout(() => {
        // Fallback timer fired before all descendants signalled — we
        // assume something didn't wire its exit. Settle anyway so the
        // tree always unmounts.
        settle();
      }, fallbackDurationMs);
      return () => clearTimeout(timeoutId);
    }
    // No transition required (steady state). Sync phase to match
    // open in case nothing flipped but a remount happened.
    setPhase(open ? 'open' : 'closed');
    return undefined;
  }, [fallbackDurationMs, open, settle]);

  // Phase-aware presence value the ExitBoundary publishes. The
  // identity is stable for a given `phase`/`registerExit` pair so
  // descendants don't rebind their effects on unrelated parent
  // re-renders.
  const value = useMemo<PresenceContextValue>(
    () => ({ phase, registerExit }),
    [phase, registerExit],
  );

  const ExitBoundary = useCallback(
    ({ children }: { children: ReactNode }): ReactElement => (
      <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
    ),
    [value],
  );

  return {
    shouldRender: phase === 'open' || phase === 'exiting' || phase === 'entering',
    phase,
    ExitBoundary,
  };
}

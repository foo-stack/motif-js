'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Possible motion phases for an element managed by an exit-aware
 * boundary.
 *
 * - `'closed'` — element should not be rendered.
 * - `'entering'` — element just mounted; not used in T1.1 but reserved
 *   for future symmetry with `enterStyle` orchestration.
 * - `'open'` — element is steady-state open.
 * - `'exiting'` — `open` flipped to `false` but the element is still
 *   rendered; consumers set `data-motif-state="exiting"` so motif's
 *   `exitStyle` CSS rule applies, then unmount once the transition
 *   ends (or the fallback timer fires, whichever comes first).
 */
export type MotionPhase = 'closed' | 'entering' | 'open' | 'exiting';

export interface UseExitTransitionResult {
  /** True while the element should be rendered (`open` or `exiting`). */
  readonly shouldRender: boolean;
  /** Current motion phase. */
  readonly phase: MotionPhase;
  /**
   * Ref to attach to the element whose `transitionend` event signals
   * the exit is complete. Optional — if no ref is attached the fallback
   * timer alone determines unmount timing.
   */
  readonly elementRef: React.RefObject<HTMLElement | null>;
}

/**
 * Hook that delays unmount until either a `transitionend` event fires
 * on the attached element OR a fallback timer expires (whichever
 * comes first). When the consumer's `open` flag flips from `true` to
 * `false`, the element stays rendered with phase `'exiting'` so a
 * parent can apply `data-motif-state="exiting"` and motif's
 * `exitStyle` CSS rule kicks in, animating the element out.
 *
 * The `fallbackDurationMs` parameter is the timeout in case no
 * `transitionend` fires (no transition was set, the property doesn't
 * animate, the element is unmounted from above before completing,
 * etc.). Defaults to a generous 400ms so most CSS transitions complete
 * comfortably; tune up for longer animations.
 *
 * In T1.1 only `Dialog.Content` consumes this; `Drawer` (which is
 * `Dialog.Content` underneath) inherits the behaviour for free.
 * `Popover.Content` and `Toast` adoption is tracked as a follow-on.
 */
export function useExitTransition(
  open: boolean,
  fallbackDurationMs = 400,
): UseExitTransitionResult {
  const [phase, setPhase] = useState<MotionPhase>(open ? 'open' : 'closed');
  const elementRef = useRef<HTMLElement | null>(null);
  const previousOpenRef = useRef<boolean>(open);

  useEffect(() => {
    const wasOpen = previousOpenRef.current;
    previousOpenRef.current = open;

    if (open && !wasOpen) {
      setPhase('open');
      return;
    }
    if (!open && wasOpen) {
      // Closing — when no exit duration is configured, settle
      // synchronously so callers without exit animations behave like
      // the pre-T1.1 instant-unmount path.
      if (fallbackDurationMs <= 0) {
        setPhase('closed');
        return undefined;
      }
      // Otherwise: keep rendered, flip phase, listen for end.
      setPhase('exiting');
      const el = elementRef.current;
      const cleanups: Array<() => void> = [];
      let settled = false;
      const settle = (): void => {
        if (settled) return;
        settled = true;
        setPhase('closed');
      };
      if (el !== null) {
        const onEnd = (event: TransitionEvent): void => {
          // Only react to transitions on the element itself (not bubbled
          // children) — this matches the contract that the exit style
          // is applied at the surface level.
          if (event.target !== el) return;
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
    // No transition required (open with no prior open=true, or already
    // closed). Sync phase to open in case nothing flipped but a remount
    // happened.
    setPhase(open ? 'open' : 'closed');
    return undefined;
  }, [open, fallbackDurationMs]);

  return {
    shouldRender: phase === 'open' || phase === 'exiting' || phase === 'entering',
    phase,
    elementRef,
  };
}

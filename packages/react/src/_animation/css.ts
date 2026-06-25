'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';
import { isReducedMotionSync } from '../_stagger-context.js';
import type { WebEntryOptions, WebEntryState, WebExitOptions, WebMotionDriver } from './types.js';

/**
 * Default web motion driver — the way motif has always played entry
 * animations.
 *
 * 1. The initial render (server AND first client/hydration render) settles
 *    at the resting style, so the SSR HTML never contains the hidden overlay
 *    (no FOUC) and the first client render is byte-identical to the server
 *    output (no hydration mismatch).
 * 2. A `useLayoutEffect` (client only) flips `entering` to `true` before the
 *    first client paint, so the very first painted frame shows the `from`
 *    overlay; a `requestAnimationFrame` then flips it back on the next frame
 *    and the element's declared CSS `transition` interpolates each property
 *    to rest.
 *
 * No element ref is needed — the CSS transition engine does the work — so
 * the driver leaves {@link WebMotionDriver.needsRef} unset.
 */
export const cssDriver: WebMotionDriver = {
  name: 'css',
  useEntry(_ref: RefObject<HTMLElement | null>, opts: WebEntryOptions): WebEntryState {
    const [entering, setEntering] = useState<boolean>(false);
    // Reduced motion is read post-mount (not at render): `false` on the
    // server and first client paint so hydrated markup matches, then the real
    // value skips the overlay and collapses the stagger delay on the next
    // commit. Reading it at render would reintroduce a hydration mismatch.
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);

    useLayoutEffect(() => {
      if (isReducedMotionSync()) {
        setReducedMotion(true);
        return undefined;
      }
      setEntering(true);
      const id = requestAnimationFrame(() => {
        setEntering(false);
      });
      return () => cancelAnimationFrame(id);
    }, []);

    return { overlay: entering ? opts.from : null, reducedMotion };
  },
  // No-op: with the CSS driver, exit rides the cascade — the presence boundary
  // sets `data-motif-state="exiting"`, motif's `[data-motif-state="exiting"]`
  // rule applies `exitStyle`, and the boundary's own `transitionend`/fallback
  // timer settles the unmount. Defined so the host can call `useExit`
  // unconditionally whichever driver is active; it intentionally never calls
  // `onComplete` (the cascade path owns settling here).
  useExit(_ref: RefObject<HTMLElement | null>, _opts: WebExitOptions): void {
    // intentionally empty
  },
};

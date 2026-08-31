'use client';

import { createContext, useContext } from 'react';

/**
 * Internal stagger context. `<Stack stagger={s}>` (and any future
 * container that opts into stagger) wraps each direct child in a
 * provider carrying the per-child delay (in seconds). `<Box>` reads
 * the context inside its entry-animation dispatch path and adds the
 * matching `transitionDelay` to its inline style; descendants without
 * `enterStyle` are unaffected.
 *
 * Default value `0` means "no stagger" - providers that don't set a
 * delay still let consumers compose without conditional reads.
 */
export const StaggerContext = createContext<number>(0);

/**
 * Read the current stagger delay (seconds). `<Stack stagger={s}>` sets
 * this to `index * s` for each direct child; outside any stagger
 * provider it returns `0`.
 */
export function useStaggerDelay(): number {
  return useContext(StaggerContext);
}

/**
 * Synchronous reduced-motion query - used by `Stack` to collapse
 * stagger to `0` when `prefers-reduced-motion: reduce` is on at
 * render time.
 *
 * Why sync: `Stack` needs the answer at render so it can decide which
 * wrapper shape to emit. A useEffect-driven hook would render with the
 * "wrong" stagger for one frame, which is itself an animation. Reading
 * `matchMedia` at render is cheap and the property doesn't churn
 * frame-to-frame.
 *
 * SSR: returns `false` (no `window`) so server output matches the
 * non-reduced-motion render; subsequent hydration paths take the live
 * value on re-render.
 */
export function isReducedMotionSync(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

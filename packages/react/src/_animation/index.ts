import { cssDriver } from './css.js';
import type { WebMotionDriver } from './types.js';

let activeDriver: WebMotionDriver = cssDriver;

/**
 * Replace the active web motion driver. Call once at app startup, before
 * any motif primitive with `enterStyle` mounts. Calling again replaces the
 * driver for future renders; in-flight animations are unaffected. Because a
 * driver's `useEntry` runs as a hook, swapping a driver with a different
 * hook shape under already-mounted animated elements is unsupported — set it
 * once, up front.
 *
 * ```tsx
 * import { registerMotionDriver, waapiDriver } from '@usemotif/react';
 *
 * registerMotionDriver(waapiDriver);
 * ```
 *
 * Pass `null` to revert to the default ({@link cssDriver}).
 */
export function registerMotionDriver(driver: WebMotionDriver | null): void {
  activeDriver = driver ?? cssDriver;
}

/** Read the active driver. Used by `Box` (entry path) and tests. */
export function getMotionDriver(): WebMotionDriver {
  return activeDriver;
}

export { cssDriver };
export type { WebEntryOptions, WebEntryState, WebMotionDriver } from './types.js';

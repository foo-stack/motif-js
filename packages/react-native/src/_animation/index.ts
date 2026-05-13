import { animatedDriver } from './animated.js';
import { noopDriver } from './noop.js';
import type { MotionDriver } from './types.js';

let activeDriver: MotionDriver = animatedDriver;

/**
 * Replace the active motion driver. Call once at app startup, before
 * any motif primitive with `enterStyle` mounts. Calling again replaces
 * the driver for future renders; in-flight animations are unaffected.
 *
 * ```tsx
 * import { registerMotionDriver } from '@usemotif/react-native';
 * import { reanimatedDriver } from '@usemotif/react-native/reanimated';
 *
 * registerMotionDriver(reanimatedDriver);
 * ```
 *
 * Pass `null` to revert to the default (`animatedDriver`).
 */
export function registerMotionDriver(driver: MotionDriver | null): void {
  activeDriver = driver ?? animatedDriver;
}

/** Read the active driver. Used by `Box` and tests. */
export function getMotionDriver(): MotionDriver {
  return activeDriver;
}

export { animatedDriver, noopDriver };
export type { MotionDriver, MotionDriverEntryOptions } from './types.js';

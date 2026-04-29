/**
 * Motion driver — pluggable engine that powers `enterStyle` on native.
 *
 * Why pluggable: Reanimated runs on the UI thread for 60fps animation
 * but is an optional peer dependency (consumers may or may not have it
 * installed). RN's built-in `Animated` API runs on the JS thread but
 * ships with React Native itself, so it's the safe default. Tests
 * register a `noop` driver for determinism.
 *
 * Drivers are registered via `registerMotionDriver()` from the package
 * root. The default is `animatedDriver`. Apps wanting Reanimated import
 * `reanimatedDriver` and register it once at startup.
 */
export interface MotionDriverEntryOptions {
  /** Style values at the start of the entry animation. */
  readonly from: Record<string, string | number>;
  /** Style values at the end of the entry animation (the resolved base style). */
  readonly to: Record<string, string | number>;
  /** Duration of the animation in milliseconds. */
  readonly durationMs: number;
  /**
   * Easing keyword (`'linear'`, `'ease'`, `'ease-in'`, `'ease-out'`,
   * `'ease-in-out'`) or a CSS `cubic-bezier(...)` string. Drivers map
   * these to their native easing form; unrecognised values fall back
   * to `'ease-in-out'`.
   */
  readonly easing: string;
}

/**
 * Options for the exit animation. Mirrors {@link MotionDriverEntryOptions}
 * but the direction is reversed (`from` is the resolved base style,
 * `to` is the `exitStyle` overlay) and the driver must call
 * `onComplete` when the animation settles so the parent presence
 * boundary can unmount the subtree.
 */
export interface MotionDriverExitOptions {
  /** Style values at the start of the exit animation (current resolved base style). */
  readonly from: Record<string, string | number>;
  /** Style values at the end of the exit animation (the `exitStyle` overlay). */
  readonly to: Record<string, string | number>;
  /** Duration of the animation in milliseconds. */
  readonly durationMs: number;
  /** Same easing surface as {@link MotionDriverEntryOptions.easing}. */
  readonly easing: string;
  /**
   * Called once when the exit animation settles. The parent presence
   * boundary uses this to count "all descendants done"; calling more
   * than once is a no-op on the parent side.
   */
  readonly onComplete: () => void;
}

export interface MotionDriver {
  /** Unique name — useful in tests for asserting which driver ran. */
  readonly name: string;
  /**
   * React hook that drives a one-shot entry animation. Returns the
   * overlay style to apply on the current render — `null` once the
   * animation has settled and the overlay is no longer needed (the
   * underlying base style takes over).
   *
   * Hooks must be called unconditionally; callers should only mount
   * components that invoke this hook when entry animation is desired.
   */
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, string | number> | null;
  /**
   * React hook that drives a one-shot exit animation. Returns the
   * per-frame overlay style applied during the exit (always
   * non-null — the element is unmounted by the parent boundary once
   * `onComplete` fires; nothing observes a settled exit overlay).
   *
   * Hooks must be called unconditionally; callers should only mount
   * components that invoke this hook when an exit is in flight.
   */
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, string | number>;
}

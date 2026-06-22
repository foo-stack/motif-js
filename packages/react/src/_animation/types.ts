import type { RefObject } from 'react';

/**
 * Options handed to a web motion driver's entry hook. `from` is the
 * resolved enter overlay — the hidden start state the element animates
 * away from on mount.
 */
export interface WebEntryOptions {
  /** Resolved "from" overlay — the enter style as inline CSS values. */
  readonly from: Record<string, string | number>;
  /** Per-child stagger delay in seconds (0 when none). */
  readonly delaySec: number;
}

/** What an entry hook returns to the host for the current render. */
export interface WebEntryState {
  /**
   * Inline-style overlay to merge for THIS render, or `null` once settled.
   * The CSS driver returns the `from` overlay for one painted frame so the
   * browser's CSS transition interpolates each property back to rest; the
   * WAAPI driver returns `null` and drives the element imperatively instead.
   */
  readonly overlay: Record<string, string | number> | null;
  /**
   * Whether the user prefers reduced motion. The host suppresses the
   * stagger delay when this is true. Read post-mount, so it stays `false`
   * on the server and the first client paint (keeps hydration identical).
   */
  readonly reducedMotion: boolean;
}

/**
 * A web motion driver owns *how* an element's entry animation plays. The
 * default {@link cssDriver} toggles an overlay and lets a CSS transition
 * interpolate; the opt-in WAAPI driver runs the animation off the main
 * thread via `element.animate()`. One driver is active per app, selected
 * through `registerMotionDriver`, mirroring the native driver model.
 */
export interface WebMotionDriver {
  /** Unique name, for tests and debugging. */
  readonly name: string;
  /**
   * When `true`, the host attaches a ref to the animated element and passes
   * it to {@link useEntry}. Drivers that animate imperatively (WAAPI) need
   * it; the CSS driver does not, so the host skips the ref for arbitrary
   * `as` components that may not forward one.
   */
  readonly needsRef?: boolean;
  /**
   * Per-instance entry hook. Called unconditionally by the host, so it must
   * obey the rules of hooks. `ref.current` is populated only when
   * {@link needsRef} is `true`.
   */
  useEntry(ref: RefObject<HTMLElement | null>, opts: WebEntryOptions): WebEntryState;
}

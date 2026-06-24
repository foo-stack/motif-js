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
 * Options handed to a web motion driver's exit hook. `to` is the resolved
 * exit overlay — the inline CSS values the element animates toward as it
 * leaves, before its presence boundary unmounts it.
 */
export interface WebExitOptions {
  /** Resolved exit overlay — `exitStyle` as inline CSS values. */
  readonly to: Record<string, string | number>;
  /**
   * True while the element is in the exiting phase (its presence boundary
   * flipped `open` → false but is keeping it mounted for the exit). The driver
   * starts the exit when this turns `true` and tears it down (cancels) when it
   * turns `false` again — an interrupted exit, e.g. the element is re-shown
   * mid-leave.
   */
  readonly active: boolean;
  /**
   * Called when the exit settles (the driver's animation finished). The host
   * uses this to release the element for unmount. Never called for an
   * interrupted (cancelled) exit. The CSS driver never calls it — there the
   * cascade plays the exit and the host's own `transitionend`/timer settles.
   */
  readonly onComplete: () => void;
}

/**
 * A web motion driver owns *how* an element's entry AND exit animations play.
 * The default {@link cssDriver} toggles an overlay / leans on the CSS cascade;
 * the opt-in WAAPI driver runs both off the main thread via `element.animate()`.
 * One driver is active per app, selected through `registerMotionDriver`,
 * mirroring the native driver model.
 */
export interface WebMotionDriver {
  /** Unique name, for tests and debugging. */
  readonly name: string;
  /**
   * When `true`, the host attaches a ref to the animated element and passes
   * it to {@link useEntry} / {@link useExit}. Drivers that animate imperatively
   * (WAAPI) need it; the CSS driver does not, so the host skips the ref for
   * arbitrary `as` components that may not forward one.
   */
  readonly needsRef?: boolean;
  /**
   * Per-instance entry hook. Called unconditionally by the host, so it must
   * obey the rules of hooks. `ref.current` is populated only when
   * {@link needsRef} is `true`.
   */
  useEntry(ref: RefObject<HTMLElement | null>, opts: WebEntryOptions): WebEntryState;
  /**
   * Per-instance exit hook. Called unconditionally by the host (rules of
   * hooks). When {@link WebExitOptions.active} turns `true` the driver plays
   * the exit toward {@link WebExitOptions.to} and calls
   * {@link WebExitOptions.onComplete} when it settles. The CSS driver no-ops
   * (the cascade owns exit there). `ref.current` is populated only when
   * {@link needsRef} is `true`.
   */
  useExit(ref: RefObject<HTMLElement | null>, opts: WebExitOptions): void;
}

import type { MotionValue, TransformAxis } from '@usemotif/core';
import type { ComponentType } from 'react';

/**
 * Motion driver — pluggable engine that powers `enterStyle` and
 * motion-value bindings on native.
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
  /**
   * Delay before the animation starts, in milliseconds. Drivers
   * `setTimeout`-defer the start of the underlying animation so the
   * overlay still emits `from` during the delay window, then plays
   * the interpolation as normal.
   *
   * `<Stack stagger>` sets this to `index * stagger` for each direct
   * child, producing a waved entry across the list.
   */
  readonly delayMs?: number;
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

/**
 * One motion-value binding handed to the driver. The driver subscribes
 * to `mv` internally and writes the new value into whatever animated
 * primitive backs the style entry it returns (RN `Animated.Value`,
 * Reanimated shared value, etc.).
 *
 * V1 supports numeric motion values; non-numeric bindings are
 * skipped at the driver level with a dev warning.
 */
export interface MotionValueDriverBinding {
  /** Resolved CSS / RN style property the binding targets. */
  readonly cssProperty: string;
  /** The motion value to subscribe to. */
  readonly mv: MotionValue;
  /** Transform-axis name when this binding participates in the
   * `transform`-composition path (`x`, `y`, `rotate`, etc.); `undefined`
   * for normal bindings. Multiple axis bindings on one Box share the
   * `transform` slot — drivers compose them via
   * `composeTransformAxesNative`. */
  readonly transformAxis: TransformAxis | undefined;
}

/**
 * Result returned by {@link MotionDriver.useMotionValueBacking}. The
 * Box wrapper merges `overlay` into the View's style array and renders
 * through `Host` if provided (otherwise the driver's `AnimatedHost`,
 * otherwise plain `View`).
 */
export interface MotionValueDriverResult {
  /**
   * Style overlay merged into the View's style array. Keys are
   * CSS / RN style property names; values are either literal numbers /
   * strings or driver-native animated primitives (RN `Animated.Value`,
   * Reanimated worklet style, …) — the matching `Host` consumes them.
   */
  readonly overlay: Record<string, unknown>;
  /**
   * Host override for renders that route through this method's
   * overlay. Required whenever `overlay` carries driver-native
   * animated primitives that plain `View` can't consume (e.g. an
   * `Animated.Value` in the style record needs RN's `Animated.View`).
   * Falls back to the driver's `AnimatedHost`, then plain `View`.
   */
  readonly Host?: ComponentType<unknown>;
}

/**
 * Resolved spring configuration handed to a driver-backed spring. Same
 * shape `useSpring` already resolves internally; lifted here so drivers
 * can translate to their platform-native spring API (`Animated.spring`,
 * Reanimated's `withSpring`, …) without re-implementing token / theme
 * resolution.
 */
export interface SpringBackingConfig {
  /** Spring stiffness. Higher = faster snap. */
  readonly stiffness: number;
  /** Damping coefficient. Higher = less oscillation. */
  readonly damping: number;
  /** Mass of the spring. Higher = slower. */
  readonly mass: number;
  /** Settle threshold for velocity. */
  readonly restSpeed: number;
  /** Settle threshold for distance to target. */
  readonly restDistance: number;
  /** Initial velocity seed on first `.set()`. */
  readonly velocity: number;
}

export interface SpringBackingOptions {
  /** Initial spring value — used only on first mount. */
  readonly initial: number;
  /**
   * Resolved config snapshot. Drivers read this on each `setTarget`
   * call (config can change between renders; the spring picks up the
   * latest values on the next retarget).
   */
  readonly config: SpringBackingConfig;
}

/**
 * Driver-side spring handle returned by
 * {@link MotionDriver.useSpringBacking}. `useSpring` wraps the handle in
 * a {@link MotionValue} so the rest of the system sees a normal
 * subscribable numeric value — but the spring integrator runs on
 * whatever thread the driver chose (`Animated`'s native side,
 * Reanimated's UI thread, …).
 *
 * Handle method identities are stable across renders of the same
 * component (drivers must store them in refs or use `useCallback`)
 * so the MV wrapper in `useSpring` can capture them once.
 */
export interface SpringBackingHandle {
  /** Snapshot the current value. */
  get(): number;
  /** Set a new target. Latest config snapshot is passed so the driver
   * can re-target with current stiffness/damping/etc. without
   * reallocating the spring. */
  setTarget(target: number, config: SpringBackingConfig): void;
  /** Subscribe to value updates. Returns an unsubscribe. */
  subscribe(cb: (value: number) => void): () => void;
}

export interface MotionDriver {
  /** Unique name — useful in tests for asserting which driver ran. */
  readonly name: string;
  /**
   * Optional host-component override. Drivers that render onto a
   * custom view (e.g. Reanimated's `Animated.View`, which is the
   * only way `useAnimatedStyle` results actually animate on the UI
   * thread) return their host here. Box uses
   * `driver.AnimatedHost ?? View` whenever motion props are active.
   *
   * The host must accept `ViewProps`-shaped props (notably `style`,
   * which Box passes as a flat array) — drivers that need richer
   * host wiring should wrap their underlying component before
   * exposing it.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly AnimatedHost?: any;
  /**
   * React hook that drives a one-shot entry animation. Returns the
   * overlay style to apply on the current render — `null` once the
   * animation has settled and the overlay is no longer needed (the
   * underlying base style takes over).
   *
   * For drivers whose return value is an opaque animated-style proxy
   * (e.g. Reanimated's `useAnimatedStyle` result), the value is
   * still stored in the same array slot Box passes to
   * {@link AnimatedHost}; the host knows how to consume it.
   *
   * Hooks must be called unconditionally; callers should only mount
   * components that invoke this hook when entry animation is desired.
   */
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, unknown> | null;
  /**
   * React hook that drives a one-shot exit animation. Returns the
   * per-frame overlay style applied during the exit (always
   * non-null — the element is unmounted by the parent boundary once
   * `onComplete` fires; nothing observes a settled exit overlay).
   *
   * Hooks must be called unconditionally; callers should only mount
   * components that invoke this hook when an exit is in flight.
   */
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, unknown>;
  /**
   * React hook that drives one or more motion-value-bound style props.
   * Called by `Box` on every render of a component that has at least
   * one motion-value-typed style prop. The driver:
   *
   * 1. Maintains a stable animated primitive per binding (the
   *    cssProperty key is the stable identifier — consumers swapping
   *    MV instances on the same prop slot get a fresh primitive).
   * 2. Subscribes to each binding's `mv` and writes the new value into
   *    the corresponding animated primitive on change.
   * 3. Returns an `overlay` style record (keyed by cssProperty) plus
   *    an optional `Host` to render through.
   *
   * Optional — drivers that don't implement this leave Box on its
   * literal-style codepath for MV-bound props (effectively snapping
   * to the initial value and ignoring `.set()` calls). The default
   * `animatedDriver` and `reanimatedDriver` both implement it; the
   * `noopDriver` returns a static literal-value overlay so tests
   * stay deterministic.
   */
  readonly useMotionValueBacking?: (
    bindings: readonly MotionValueDriverBinding[],
  ) => MotionValueDriverResult;
  /**
   * React hook that backs a {@link MotionValue}-shaped spring with a
   * driver-native integrator. `useSpring` calls this once per mount;
   * the returned {@link SpringBackingHandle} drives the MV exposed to
   * the consumer.
   *
   * Drivers that don't implement this leave `useSpring` on its JS-thread
   * `requestAnimationFrame` integrator — the safe, deps-free path that
   * shipped first. Implementations:
   *
   * - `animatedDriver` — `Animated.spring` with a `Value.addListener`
   *   bridge to JS-thread subscribers.
   * - `reanimatedDriver` — `withSpring` on the UI thread when the peer is
   *   loadable; rAF fallback otherwise (so the driver doesn't degrade
   *   harder than the default would).
   * - `noopDriver` — snaps to target (matches its no-animation contract).
   */
  readonly useSpringBacking?: (opts: SpringBackingOptions) => SpringBackingHandle;
}

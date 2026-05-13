import { resolveStyles, type MotionStyleBag, type Theme } from '@usemotif/core';
import { createElement, useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { getMotionDriver } from './_animation/index.js';
import { usePresence } from './_animation/presence-context.js';

export interface BoxWithExitProps {
  readonly passThrough: ViewProps;
  readonly baseStyle: ViewStyle;
  readonly userStyle: ViewStyle | readonly ViewStyle[] | undefined;
  readonly exitStyle: MotionStyleBag;
  readonly theme: Theme | undefined;
  readonly durationMs: number;
  readonly easing: string;
  readonly children?: ReactNode;
}

/**
 * Internal sub-component that runs the per-instance exit animation on
 * native. Box dispatches here only when `exitStyle !== undefined`,
 * so call sites without exit animation pay no driver cost.
 *
 * Mechanics:
 *
 * 1. Reads the parent presence boundary's phase via {@link usePresence}.
 *    Outside of `'exiting'` the path renders the resolved base style
 *    and is byte-equivalent to a non-motion render.
 * 2. When phase flips to `'exiting'`, registers a pending exit with
 *    the boundary (so the parent waits for this descendant before
 *    unmounting) and runs the active driver's `useExitAnimation`
 *    from `baseStyle` toward `exitStyle`.
 * 3. The driver calls `onComplete` when settled; the descendant
 *    forwards that to the boundary's signal-complete callback so
 *    the boundary can settle (or the fallback timer fires first —
 *    whichever).
 *
 * If the descendant unmounts mid-flight (e.g. the parent settled via
 * fallback timer), the cleanup path still calls the boundary's
 * complete callback so the registration set drains correctly.
 */
export function BoxWithExitNative(props: BoxWithExitProps) {
  const { passThrough, baseStyle, userStyle, exitStyle, theme, durationMs, easing, children } =
    props;
  const presence = usePresence();
  const isExiting = presence.phase === 'exiting';

  // Capture the boundary's complete-callback for this exit window.
  // Acquired lazily on the first render where `isExiting` is true so
  // we don't burn a registration when the descendant never enters
  // the exit phase.
  const completeRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!isExiting) return;
    if (completeRef.current === null) {
      completeRef.current = presence.registerExit();
    }
    return () => {
      // Safety net: if the descendant unmounts before the driver
      // signals completion (parent fallback timer fired first, or
      // user navigated away), drain the registration so the boundary
      // can settle.
      completeRef.current?.();
      completeRef.current = null;
    };
  }, [isExiting, presence]);

  const driver = getMotionDriver();
  const fromResolved = pickAnimatableEntries(baseStyle as Record<string, string | number>);
  const toResolved = resolveStyles(exitStyle as Record<string, unknown>, theme).style as Record<
    string,
    string | number
  >;

  // The driver hook must be called unconditionally (rules of hooks).
  // When the descendant isn't exiting, we hand it a settled-instantly
  // pair so it returns `to` (which equals `from` here). The result is
  // dropped and the base-style render path runs untouched. The cost
  // is one no-op driver call per render in the common steady-state
  // case, which is negligible.
  const overlay = driver.useExitAnimation({
    from: isExiting ? fromResolved : EMPTY_STYLE,
    to: isExiting ? toResolved : EMPTY_STYLE,
    durationMs: isExiting ? durationMs : 0,
    easing,
    onComplete: isExiting
      ? () => {
          completeRef.current?.();
          completeRef.current = null;
        }
      : NOOP,
  });

  const sheet = StyleSheet.create({ box: baseStyle });
  const styles: ViewStyle[] = [sheet.box];
  if (isExiting) styles.push(overlay as ViewStyle);
  if (userStyle !== undefined) {
    if (Array.isArray(userStyle)) styles.push(...(userStyle as ViewStyle[]));
    else styles.push(userStyle as ViewStyle);
  }

  // Same custom-host swap as the entry path: drivers that need a
  // Reanimated-style host (`Animated.View`) provide it via
  // `AnimatedHost`; otherwise we fall back to plain `View`.
  const Host = (driver.AnimatedHost ?? View) as typeof View;
  return createElement(Host, { ...passThrough, style: styles }, children);
}

const EMPTY_STYLE: Record<string, string | number> = {};
const NOOP = (): void => {};

/**
 * Filter the resolved base style down to entries the driver can
 * interpolate over (numbers + strings). Skips arrays / objects /
 * undefined which would crash the driver's `interpolateStyles`.
 */
function pickAnimatableEntries(
  style: Record<string, string | number>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(style)) {
    if (typeof v === 'number' || typeof v === 'string') out[k] = v;
  }
  return out;
}

import { resolveStyles, type MotionStyleBag, type Theme } from '@usemotif/core';
import { createElement, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { getMotionDriver } from './_animation/index.js';
import { restingValueFor } from './_animation/resting.js';
import { useStaggerDelay } from './_stagger-context.js';

export interface BoxWithEnterProps {
  readonly passThrough: ViewProps;
  readonly baseStyle: ViewStyle;
  readonly userStyle: ViewStyle | readonly ViewStyle[] | undefined;
  readonly enterStyle: MotionStyleBag;
  readonly theme: Theme | undefined;
  readonly durationMs: number;
  readonly easing: string;
  readonly children?: ReactNode;
}

/**
 * Internal sub-component that owns the per-instance entry-animation
 * state on native. Box dispatches here only when `enterStyle !== undefined`,
 * so call sites without entry animation pay no driver cost.
 *
 * Mechanics:
 *
 * 1. `enterStyle` is resolved against the current theme to a literal
 *    style bag (the `from` values).
 * 2. The active motion driver runs a one-shot entry animation from
 *    `from` toward the corresponding `to` values pulled from the
 *    resolved base style. The driver returns a per-frame overlay
 *    style — `null` once the animation has settled.
 * 3. We render `View` with `[base, overlay, userStyle]`. When overlay
 *    is `null` the base style alone applies, identical to a non-
 *    motion render.
 *
 * SSR is not relevant on native (no server render path), so unlike the
 * web counterpart there's no special first-paint policy — the entry
 * animation always runs on first mount of the component.
 */
export function BoxWithEnterNative(props: BoxWithEnterProps) {
  const { passThrough, baseStyle, userStyle, enterStyle, theme, durationMs, easing, children } =
    props;

  const fromResolved = resolveStyles(enterStyle as Record<string, unknown>, theme).style as Record<
    string,
    string | number
  >;
  const toResolved = resolveEnterTargets(
    baseStyle as Record<string, string | number>,
    fromResolved,
  );

  const driver = getMotionDriver();
  // Parent `<Stack stagger>` provides a per-child delay (seconds);
  // forward it to the driver as `delayMs`. Drivers that don't honour
  // the delay reduce to no-op (snap on settle).
  const staggerDelaySec = useStaggerDelay();
  const overlay = driver.useEntryAnimation({
    from: fromResolved,
    to: toResolved,
    durationMs,
    easing,
    delayMs: staggerDelaySec * 1000,
  });

  const sheet = StyleSheet.create({ box: baseStyle });
  const styles: ViewStyle[] = [sheet.box];
  if (overlay !== null) styles.push(overlay as ViewStyle);
  if (userStyle !== undefined) {
    if (Array.isArray(userStyle)) styles.push(...(userStyle as ViewStyle[]));
    else styles.push(userStyle as ViewStyle);
  }

  // Drivers that need a custom host (e.g. Reanimated's `Animated.View`
  // for UI-thread style updates) provide it via `AnimatedHost`. The
  // overlay flows through unchanged — Reanimated treats a worklet-
  // produced style object as a normal style array entry on its own
  // host, while plain `View` accepts the dictionary shape of the
  // animated/noop drivers.
  const Host = (driver.AnimatedHost ?? View) as typeof View;
  return createElement(Host, { ...passThrough, style: styles }, children);
}

/**
 * Build the entry-animation target for every key the `enterStyle` (`from`)
 * declares. When the base style pins the key, animate toward that value;
 * otherwise animate toward the property's natural resting value — so an
 * enter-only key like `opacity` resolves to `1`, not the blind `0` that
 * `pickMatchingKeys` (which dropped non-base keys entirely) used to leave.
 */
function resolveEnterTargets(
  base: Record<string, string | number>,
  from: Record<string, string | number>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(from)) {
    out[k] = k in base ? base[k]! : restingValueFor(k);
  }
  return out;
}

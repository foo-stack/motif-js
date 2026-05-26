import { resolveStyles, type MotionStyleBag, type Theme } from '@usemotif/core';
import { createElement, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { getMotionDriver } from './_animation/index.js';
import type { MotionValueDriverResult } from './_animation/types.js';
import type { MotionBinding } from './_motion-bindings.js';

export interface BoxWithMotionValuesNativeProps {
  readonly passThrough: ViewProps;
  readonly baseStyle: ViewStyle;
  readonly userStyle: ViewStyle | readonly ViewStyle[] | undefined;
  readonly motionBindings: readonly MotionBinding[];
  /** Set when the Box also has an entry animation. */
  readonly enterStyle: MotionStyleBag | undefined;
  /** Resolved entry timing (mirrors `parseEntryTiming` in Box). */
  readonly enterDurationMs: number;
  readonly enterEasing: string;
  readonly theme: Theme | undefined;
  readonly children?: ReactNode;
}

/**
 * Native wrapper for any `<Box>` whose props include a motion value.
 * Dispatches the bindings to the active motion driver's
 * `useMotionValueBacking` hook, which:
 *
 * - Maintains a stable animated primitive per binding (RN
 *   `Animated.Value` for the default driver; Reanimated shared value
 *   for the UI-thread driver).
 * - Subscribes to each motion value internally and writes the new
 *   value into its primitive, bypassing React's render cycle.
 * - Returns a style overlay merged into the View's style array, and
 *   optionally a custom host (`Animated.View`) that knows how to
 *   consume driver-native style values.
 *
 * Entry-animation interop: when both `enterStyle` and motion values
 * are set, the entry runs first (one-shot through the driver's
 * `useEntryAnimation`); the motion-value overlay layers on top. The
 * two style streams don't fight because the entry overlay snaps to
 * `null` once settled.
 *
 * Box dispatches here only when at least one motion-value-typed style
 * prop is present.
 */
export function BoxWithMotionValuesNative(props: BoxWithMotionValuesNativeProps) {
  const {
    passThrough,
    baseStyle,
    userStyle,
    motionBindings,
    enterStyle,
    enterDurationMs,
    enterEasing,
    theme,
    children,
  } = props;

  const driver = getMotionDriver();

  // MV backing — drive each binding through the active driver. The
  // driver owns its own subscription lifecycle; we just merge the
  // returned overlay into the View's style array.
  //
  // Drivers that don't implement `useMotionValueBacking` fall back to
  // a literal-pass-through: snap to the initial value and ignore
  // `.set()` calls. This keeps Box renderable even with a stub
  // driver (e.g. a custom test driver that doesn't care about MV).
  const mvResult = driver.useMotionValueBacking?.(motionBindings) ?? FALLBACK_RESULT(motionBindings);

  // Entry overlay (only computed when enterStyle is set). Mirror the
  // existing `BoxWithEnterNative` mechanic — driver.useEntryAnimation
  // returns the per-frame overlay or `null` once settled.
  const hasEnter = enterStyle !== undefined;
  const fromResolved = hasEnter
    ? (resolveStyles(enterStyle as unknown as Record<string, unknown>, theme).style as Record<
        string,
        string | number
      >)
    : EMPTY_STYLE;
  const toResolved = hasEnter
    ? pickMatchingKeys(baseStyle as Record<string, string | number>, fromResolved)
    : EMPTY_STYLE;
  const entryOverlay = hasEnter
    ? driver.useEntryAnimation({
        from: fromResolved,
        to: toResolved,
        durationMs: enterDurationMs,
        easing: enterEasing,
      })
    : null;

  const sheet = StyleSheet.create({ box: baseStyle });
  const styles: ViewStyle[] = [sheet.box];
  if (entryOverlay !== null) styles.push(entryOverlay as ViewStyle);
  // MV overlay always layers last (highest precedence among Motif-
  // generated layers) so its imperative values override entry overlay
  // values for the same prop slot once the entry has settled.
  if (Object.keys(mvResult.overlay).length > 0) styles.push(mvResult.overlay as ViewStyle);
  if (userStyle !== undefined) {
    if (Array.isArray(userStyle)) styles.push(...(userStyle as ViewStyle[]));
    else styles.push(userStyle as ViewStyle);
  }

  // Host precedence: MV result's Host (e.g. Animated.View for the
  // default driver when an Animated.Value is in play) wins. Falls
  // back to the driver's general AnimatedHost (Reanimated entry case),
  // then to plain View.
  const Host = (mvResult.Host ?? driver.AnimatedHost ?? View) as typeof View;
  return createElement(Host, { ...passThrough, style: styles }, children);
}

const EMPTY_STYLE: Record<string, string | number> = {};

/**
 * Literal-pass-through overlay used when the active driver doesn't
 * implement `useMotionValueBacking`. Each binding's current value
 * snaps into the overlay; no subscription. Only used when an app
 * registers a custom driver that skipped the optional method.
 */
function FALLBACK_RESULT(bindings: readonly MotionBinding[]): MotionValueDriverResult {
  const overlay: Record<string, unknown> = {};
  for (const b of bindings) {
    overlay[b.cssProperty] = b.mv.get();
  }
  return { overlay };
}

function pickMatchingKeys(
  source: Record<string, string | number>,
  shape: Record<string, string | number>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(shape)) {
    if (k in source) out[k] = source[k]!;
  }
  return out;
}

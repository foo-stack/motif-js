import {
  resolveStyles,
  resolveTransition,
  type MotionStyleProps,
  type StateStyleProps,
  type StyleProps,
  type Theme,
  type TransitionValue,
} from '@motif-js/core';
import { createElement, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { BoxWithEnterNative } from './_box-enter.js';
import { useContainerInfo } from './container-context.js';
import { resolveResponsivePropsAtViewportAndContainer, useViewportWidth } from './responsive.js';
import { useTheme } from './theme-context.js';

/**
 * Native Box props. Style props use the same schema as the web
 * renderer but are resolved to literal values via the active theme
 * (no CSS variables). Responsive object / array / DSL shapes resolve
 * against the current viewport width via `Dimensions`.
 *
 * Pseudo-state props (`_hover`, `_focus`, `_active`, `_disabled`) are
 * accepted on the type for cross-platform parity but are no-ops on
 * Box — RN `View` does not track pressed/hovered/focused state. To
 * apply state-driven styling on native, use `<Pressable>` (which uses
 * RN's children-as-style function form) or wire it up via a peer
 * gesture / animation library.
 *
 * Motion props (`enterStyle`, `exitStyle`, `transition`) drive entry
 * animations through the active motion driver. `enterStyle` runs an
 * interpolation from the given values toward the resolved base style
 * on first mount; `transition.duration` / `transition.easing` size
 * the animation. `exitStyle` is accepted for cross-platform parity
 * but ships as a no-op on native in v1 (queued for a follow-up that
 * pairs with a presence-boundary contract analogous to web's
 * `[data-motif-state="exiting"]`).
 */
export type BoxProps = {
  -readonly [K in keyof StyleProps]?: StyleProps[K] | ResponsiveValue<StyleProps[K]>;
} & StateStyleProps &
  MotionStyleProps &
  Omit<ViewProps, 'style'> & {
    style?: ViewStyle | readonly ViewStyle[];
    children?: ReactNode;
  };

type ResponsiveValue<V> =
  | ({ base?: V } & Record<string, V | undefined>)
  | readonly (V | undefined)[]
  | string;

/**
 * The atom of motif-js on native: a styled, theme-aware View.
 *
 * Token references (`bg="$colors.surface.base"`) resolve against the
 * active theme via React context. Responsive props (object / array /
 * DSL) resolve against the current viewport width via RN's
 * `Dimensions`, with the cascade going mobile-first (largest
 * breakpoint ≤ width wins, falling back to `base`).
 *
 * Container queries (`@<bp>` / `@<name>.<bp>` keys) are dropped at
 * the viewport stage; they're handled by the `<Container>` polyfill
 * which measures itself via `onLayout`.
 */
export function Box(props: BoxProps) {
  // Pseudo-state props are accepted for cross-platform parity but
  // discarded here — RN `View` has no hovered/focused/pressed state.
  // The destructure ensures they don't leak through as DOM attributes.
  // `exitStyle` is also accepted for parity but currently no-ops on
  // native (see file-level docs).
  const {
    children,
    style: userStyle,
    _hover: _ignoredHover,
    _focus: _ignoredFocus,
    _active: _ignoredActive,
    _disabled: _ignoredDisabled,
    enterStyle,
    exitStyle: _ignoredExit,
    transition,
    ...rest
  } = props;
  void _ignoredHover;
  void _ignoredFocus;
  void _ignoredActive;
  void _ignoredDisabled;
  void _ignoredExit;

  const theme = useTheme();
  const width = useViewportWidth();
  const container = useContainerInfo();
  const flattened = resolveResponsivePropsAtViewportAndContainer(rest, width, container);
  const { style: baseStyle, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );

  if (enterStyle !== undefined) {
    const { durationMs, easing } = parseEntryTiming(transition, theme);
    return createElement(
      BoxWithEnterNative,
      {
        passThrough: passThrough as ViewProps,
        baseStyle: baseStyle as ViewStyle,
        userStyle,
        enterStyle,
        theme,
        durationMs,
        easing,
      },
      children,
    );
  }

  const sheet = StyleSheet.create({ box: baseStyle as ViewStyle });
  const finalStyle: ViewStyle[] =
    userStyle === undefined
      ? [sheet.box]
      : Array.isArray(userStyle)
        ? [sheet.box, ...(userStyle as ViewStyle[])]
        : [sheet.box, userStyle as ViewStyle];

  return createElement(
    View,
    {
      ...(passThrough as ViewProps),
      style: finalStyle,
    },
    children,
  );
}

/**
 * Extract `{ durationMs, easing }` from a `transition` prop for the
 * native motion driver. Reuses `resolveTransition` from core (which
 * resolves token refs against the theme) and parses the resulting
 * shorthand string. Defaults: 200ms, ease.
 */
function parseEntryTiming(
  transition: TransitionValue | undefined,
  theme: Theme | undefined,
): { durationMs: number; easing: string } {
  if (transition === undefined) return { durationMs: 200, easing: 'ease' };
  // Multi-property arrays: take the first entry's timing — entry
  // animations apply uniformly across all `enterStyle` keys, so one
  // duration/easing pair is sufficient.
  const first = Array.isArray(transition) ? transition[0] : transition;
  const resolved = first === undefined ? undefined : resolveTransition(first, theme);
  if (resolved === undefined) return { durationMs: 200, easing: 'ease' };
  const tokens = resolved.split(/\s+/).filter(Boolean);
  const duration = tokens[1] ?? '200ms';
  const easing = tokens[2] ?? 'ease';
  return { durationMs: parseDurationMs(duration), easing };
}

function parseDurationMs(value: string): number {
  const ms = /^([\d.]+)ms$/.exec(value);
  if (ms !== null) return Number(ms[1]);
  const s = /^([\d.]+)s$/.exec(value);
  if (s !== null) return Number(s[1]) * 1000;
  return 200;
}

/**
 * Internal helper exposing Box's style resolution for primitives that
 * need to apply Box-level styling without rendering an extra View
 * wrapper (e.g. `ScrollView` puts the resolved style on RN's
 * `contentContainerStyle` so `Sticky` children can be direct children
 * of the RN ScrollView and their indices flow into
 * `stickyHeaderIndices`).
 */
export function useResolvedBoxStyle(
  rest: Omit<BoxProps, 'children' | 'style'>,
  userStyle: BoxProps['style'],
): {
  style: ViewStyle[];
  passThrough: Record<string, unknown>;
} {
  const theme = useTheme();
  const width = useViewportWidth();
  const container = useContainerInfo();

  const flattened = resolveResponsivePropsAtViewportAndContainer(rest, width, container);
  const { style: resolved, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );

  const sheet = StyleSheet.create({ box: resolved as ViewStyle });
  const finalStyle: ViewStyle[] =
    userStyle === undefined
      ? [sheet.box]
      : Array.isArray(userStyle)
        ? [sheet.box, ...(userStyle as ViewStyle[])]
        : [sheet.box, userStyle as ViewStyle];

  return { style: finalStyle, passThrough };
}

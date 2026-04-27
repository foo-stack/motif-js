import { resolveStyles, type StyleProps } from '@motif-js/core';
import { createElement, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, type ViewProps } from 'react-native';
import { pickBaseSlots } from './responsive.js';
import { useTheme } from './theme-context.js';

/**
 * Native Box props. Style props use the same schema as the web
 * renderer but are resolved to literal values via the active theme
 * (no CSS variables). Responsive object / array / DSL shapes are
 * accepted but only the **base** slot is honored on native — the
 * container-query polyfill (Phase C follow-up) will add viewport-
 * driven slot selection.
 */
export type BoxProps = {
  -readonly [K in keyof StyleProps]?: StyleProps[K] | ResponsiveValue<StyleProps[K]>;
} & Omit<ViewProps, 'style'> & {
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
 * active theme via React context. Responsive props use the `base`
 * slot only in this iteration; `<Container>` + viewport-driven
 * resolution land in a Phase C follow-up.
 */
export function Box(props: BoxProps) {
  const { children, style: userStyle, ...rest } = props;
  const theme = useTheme();

  const flattened = pickBaseSlots(rest);
  const { style: resolved, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );

  // RN's StyleSheet.create gives perf benefits via integer style refs,
  // but `create({ x: resolved })` returns a frozen object whose keys
  // are still the same camelCase props — no transformation. The
  // overhead of `create` per render is negligible for our use case.
  const sheet = StyleSheet.create({ box: resolved as ViewStyle });
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

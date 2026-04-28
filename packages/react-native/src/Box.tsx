import { resolveStyles, type StyleProps } from '@motif-js/core';
import { createElement, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, type ViewProps } from 'react-native';
import { useContainerInfo } from './container-context.js';
import { resolveResponsivePropsAtViewportAndContainer, useViewportWidth } from './responsive.js';
import { useTheme } from './theme-context.js';

/**
 * Native Box props. Style props use the same schema as the web
 * renderer but are resolved to literal values via the active theme
 * (no CSS variables). Responsive object / array / DSL shapes resolve
 * against the current viewport width via `Dimensions`.
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
  const { children, style: userStyle, ...rest } = props;
  const { style: finalStyle, passThrough } = useResolvedBoxStyle(rest, userStyle);

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

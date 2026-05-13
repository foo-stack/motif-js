import { resolveStyles, type StyleProps } from '@usemotif/core';
import { createElement, type ReactNode } from 'react';
import {
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { useContainerInfo } from './container-context.js';
import { resolveResponsivePropsAtViewportAndContainer, useViewportWidth } from './responsive.js';
import { useTheme } from './theme-context.js';

type ResponsiveValue<V> =
  | ({ base?: V } & Record<string, V | undefined>)
  | readonly (V | undefined)[]
  | string;

/**
 * Native Text props. Same style-prop schema as Box, but the rendered
 * host is RN's `Text` (separate from `View` — you can't put text
 * directly inside a View on RN). Style-prop resolution picks
 * `base`-slot only for now (matches Box's responsive policy until
 * viewport-driven resolution lands).
 */
export type TextProps = {
  -readonly [K in keyof StyleProps]?: StyleProps[K] | ResponsiveValue<StyleProps[K]>;
} & Omit<RNTextProps, 'style'> & {
    style?: TextStyle | readonly TextStyle[];
    children?: ReactNode;
  };

/**
 * Native text primitive. Wraps RN's `Text` so font / color / line-
 * height props apply correctly (RN requires text to live inside a
 * `Text` host; styles like `fontSize` / `lineHeight` only work
 * there).
 *
 * @example
 *
 * ```tsx
 * <Text fontSize="$lg" color="$colors.text.default">
 *   Hello, motif-js
 * </Text>
 * ```
 */
export function Text(props: TextProps) {
  const { children, style: userStyle, ...rest } = props;
  const theme = useTheme();
  const width = useViewportWidth();
  const container = useContainerInfo();

  const flattened = resolveResponsivePropsAtViewportAndContainer(rest, width, container);
  const { style: resolved, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );

  const sheet = StyleSheet.create({ text: resolved as TextStyle });
  const finalStyle: TextStyle[] =
    userStyle === undefined
      ? [sheet.text]
      : Array.isArray(userStyle)
        ? [sheet.text, ...(userStyle as TextStyle[])]
        : [sheet.text, userStyle as TextStyle];

  return createElement(
    RNText,
    {
      ...(passThrough as RNTextProps),
      style: finalStyle,
    },
    children,
  );
}

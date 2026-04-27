import {
  isResponsiveObject,
  parseResponsiveDSL,
  resolveStyles,
  type StyleProps,
} from '@motif-js/core';
import { createElement, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, type ViewProps } from 'react-native';
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

/**
 * Walk a props bag and replace every responsive shape (object / array
 * / DSL string) with its `base`-slot value. Non-responsive values pass
 * through untouched. This is a stop-gap until the native viewport-
 * driven resolver lands; for now, native treats every breakpoint as
 * "the base value applies everywhere".
 */
function pickBaseSlots(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in props) {
    out[key] = pickBase(props[key]);
  }
  return out;
}

function pickBase(value: unknown): unknown {
  if (Array.isArray(value)) {
    // Array responsive: slot 0 is `base`.
    return value[0];
  }
  if (typeof value === 'string') {
    // Literal string OR DSL string. parseResponsiveDSL returns null for
    // non-DSL strings, so we keep them as literals.
    const parsed = parseResponsiveDSL(value);
    if (parsed === null) return value;
    return parsed['base'];
  }
  if (isResponsiveObject(value)) {
    // The object form may use `base` directly OR encode all slots.
    // We honor `base` here; the resolver elsewhere already produces a
    // unified object, but for direct API use we read `.base`.
    return (value as Record<string, unknown>)['base'];
  }
  return value;
}

import type { StyleProps } from '@motif-js/core';
import { Box, type BoxProps } from '@motif-js/react-web';
import type { ComponentType, ElementType, ReactElement } from 'react';
import { createElement } from 'react';

type AnyVariants = Record<string, Record<string, StyleProps>>;

/**
 * One entry in `compoundVariants` — a set of variant matchers plus the styles
 * to apply when *all* matchers are satisfied at once. Use for cases like
 * "primary intent at large size gets a heavier weight".
 */
export type CompoundVariant<V extends AnyVariants> = {
  [K in keyof V]?: keyof V[K];
} & {
  /** Style props applied when every matcher above is true. */
  css: StyleProps;
};

/**
 * Configuration object passed to `styled()`. All fields are optional —
 * the absolute minimum useful styled() takes only `base`.
 */
export interface StyledConfig<V extends AnyVariants = AnyVariants> {
  /** Style props always applied. */
  base?: StyleProps;
  /** Named groups of style overrides selected by props on the rendered component. */
  variants?: V;
  /** Style overrides applied when several variant matchers all match at once. */
  compoundVariants?: readonly CompoundVariant<V>[];
  /** Variant values used when the prop is not specified by the caller. */
  defaultVariants?: { [K in keyof V]?: keyof V[K] };
}

/**
 * Variant prop type derived from a variants config. Each variant name becomes
 * an optional prop. `boolean` variants (those with `'true'` / `'false'` keys)
 * are accepted as native booleans for ergonomics.
 */
export type VariantProps<V extends AnyVariants> = {
  [K in keyof V]?: keyof V[K] extends 'true' | 'false' ? boolean : keyof V[K];
};

/**
 * `styled(Component, config)` returns a new React component that:
 *
 * 1. Reads the variant props out of its incoming props.
 * 2. Resolves `base` + active variants + matching compound variants into a
 *    single merged style-props object.
 * 3. Renders `Component` with the merged style props (plus any pass-through
 *    props the caller supplied).
 *
 * If `Component` is a string (e.g. `'button'`), the result is rendered via
 * `<Box as="button">` so style props go through the standard pipeline.
 */
export function styled<C extends ElementType, V extends AnyVariants = {}>(
  Component: C,
  config: StyledConfig<V>,
): ComponentType<VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>> {
  const variantNames = config.variants !== undefined ? Object.keys(config.variants) : [];

  function StyledComponent(
    props: VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>,
  ): ReactElement {
    // Split the props into variant-selectors vs everything-else.
    const propsRecord = props as Record<string, unknown>;
    const variantValues: Record<string, unknown> = {};
    const passThrough: Record<string, unknown> = {};
    for (const key in propsRecord) {
      if (variantNames.includes(key)) {
        variantValues[key] = propsRecord[key];
      } else {
        passThrough[key] = propsRecord[key];
      }
    }

    // Merge with defaultVariants so `defaultVariants.size = 'md'` actually applies.
    const effectiveVariants: Record<string, unknown> = {
      ...config.defaultVariants,
      ...variantValues,
    };

    // Build the merged style props, in order:
    //   1. base
    //   2. each active variant
    //   3. each matching compoundVariant
    //   4. caller-provided style props (so callers can override anything)
    let merged: StyleProps = { ...config.base };

    if (config.variants !== undefined) {
      for (const variantName of variantNames) {
        const value = effectiveVariants[variantName];
        if (value === undefined) continue;
        const key = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
        const variantStyles = config.variants[variantName]?.[key];
        if (variantStyles !== undefined) {
          merged = { ...merged, ...variantStyles };
        }
      }
    }

    if (config.compoundVariants !== undefined) {
      for (const compound of config.compoundVariants) {
        const { css, ...matchers } = compound as CompoundVariant<V> & Record<string, unknown>;
        let allMatch = true;
        for (const matchKey in matchers) {
          const expected = matchers[matchKey];
          const actual = effectiveVariants[matchKey];
          const actualKey = typeof actual === 'boolean' ? (actual ? 'true' : 'false') : actual;
          if (actualKey !== expected) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) {
          merged = { ...merged, ...css };
        }
      }
    }

    // Caller's own style props override the merged set so users can tweak
    // a single instance without authoring a new variant.
    const finalProps: Record<string, unknown> = { ...merged, ...passThrough };

    if (typeof Component === 'string') {
      return createElement(Box, { as: Component, ...finalProps } as BoxProps);
    }
    return createElement(Component, finalProps);
  }

  StyledComponent.displayName =
    typeof Component === 'string'
      ? `styled.${Component}`
      : `styled(${Component.displayName ?? 'Component'})`;

  return StyledComponent;
}

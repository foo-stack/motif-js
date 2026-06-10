import type { StyleProps } from '@usemotif/core';
import { Box, type BoxProps } from '@usemotif/react-native';
import type { ComponentType, ElementType, ReactElement } from 'react';
import { createElement } from 'react';

/**
 * Native build of `@usemotif/react`'s `styled()` factory. Mirrors the
 * web implementation in `./styled.tsx`; the only difference is the
 * underlying Box primitive comes from `@usemotif/react-native`.
 */

type ExplicitVariant = Record<string, StyleProps>;
type FallbackVariant = (val: never) => StyleProps;
export type AnyVariants = Record<string, ExplicitVariant | FallbackVariant>;

type ExplicitNames<V> = string &
  {
    [K in keyof V]: K extends `...${string}` ? never : K;
  }[keyof V];

type FallbackNames<V> = string &
  {
    [K in keyof V]: K extends `...${infer N}` ? N : never;
  }[keyof V];

type AllVariantNames<V> = ExplicitNames<V> | FallbackNames<V>;

type ExplicitValue<V, K extends string> = K extends keyof V
  ? V[K] extends ExplicitVariant
    ? keyof V[K] extends 'true' | 'false'
      ? boolean
      : keyof V[K]
    : never
  : never;

type FallbackValue<V, K extends string> = `...${K}` extends keyof V
  ? V[`...${K}`] extends (val: infer A) => unknown
    ? A
    : never
  : never;

export type VariantProps<V extends AnyVariants> = {
  [K in AllVariantNames<V>]?: ExplicitValue<V, K> | FallbackValue<V, K>;
};

export type CompoundVariant<V extends AnyVariants> = {
  [K in keyof V as V[K] extends ExplicitVariant ? K : never]?: V[K] extends ExplicitVariant
    ? keyof V[K] extends 'true' | 'false'
      ? boolean
      : keyof V[K]
    : never;
} & {
  css: StyleProps;
};

export interface StyledConfig<V extends AnyVariants = AnyVariants> {
  base?: StyleProps;
  variants?: V;
  compoundVariants?: readonly CompoundVariant<V>[];
  defaultVariants?: {
    [K in keyof V as V[K] extends ExplicitVariant ? K : never]?: V[K] extends ExplicitVariant
      ? keyof V[K] extends 'true' | 'false'
        ? boolean
        : keyof V[K]
      : never;
  };
}

export function styled<V extends AnyVariants = Record<string, never>>(
  Component: ElementType,
  config: StyledConfig<V>,
): ComponentType<VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>> {
  const variantNames: string[] = [];
  const explicitVariants: Record<string, ExplicitVariant> = {};
  const fallbackVariants: Record<string, FallbackVariant> = {};

  if (config.variants !== undefined) {
    for (const key of Object.keys(config.variants)) {
      const value = config.variants[key];
      if (key.startsWith('...')) {
        const name = key.slice(3);
        fallbackVariants[name] = value as FallbackVariant;
        if (!variantNames.includes(name)) variantNames.push(name);
      } else {
        explicitVariants[key] = value as ExplicitVariant;
        if (!variantNames.includes(key)) variantNames.push(key);
      }
    }
  }

  function StyledComponent(
    props: VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>,
  ): ReactElement {
    const propsRecord = props as Record<string, unknown>;
    const variantValues: Record<string, unknown> = {};
    const passThrough: Record<string, unknown> = {};
    for (const key in propsRecord) {
      if (variantNames.includes(key)) {
        // Skip an explicit `undefined` variant value so it can't clobber
        // `defaultVariants` (see styled.tsx).
        if (propsRecord[key] !== undefined) variantValues[key] = propsRecord[key];
      } else if (propsRecord[key] !== undefined) {
        // An explicit `undefined` (e.g. `bg={cond ? 'red' : undefined}`) must
        // not clobber a base/variant value when `passThrough` is spread over
        // `merged` below — treat it as "prop omitted".
        passThrough[key] = propsRecord[key];
      }
    }

    const effectiveVariants: Record<string, unknown> = {
      ...(config.defaultVariants as Record<string, unknown> | undefined),
      ...variantValues,
    };

    let merged: StyleProps = { ...config.base };

    for (const variantName of variantNames) {
      const value = effectiveVariants[variantName];
      if (value === undefined) continue;
      const explicit = explicitVariants[variantName];
      const explicitKey = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
      // Own-property only — a variant value of `constructor` / `toString` /
      // `__proto__` would otherwise hit an inherited member and shadow the
      // declared fallback variant.
      const fromExplicit =
        explicit !== undefined && Object.hasOwn(explicit, explicitKey)
          ? explicit[explicitKey]
          : undefined;
      if (fromExplicit !== undefined) {
        merged = { ...merged, ...fromExplicit };
        continue;
      }
      const fallback = fallbackVariants[variantName];
      if (fallback !== undefined) {
        merged = { ...merged, ...(fallback as (val: unknown) => StyleProps)(value) };
      }
    }

    if (config.compoundVariants !== undefined) {
      for (const compound of config.compoundVariants) {
        const { css, ...matchers } = compound as CompoundVariant<V> &
          Record<string, unknown> & {
            css: StyleProps;
          };
        let allMatch = true;
        for (const matchKey in matchers) {
          const expected = matchers[matchKey];
          const actual = effectiveVariants[matchKey];
          const actualKey = typeof actual === 'boolean' ? (actual ? 'true' : 'false') : actual;
          const expectedKey =
            typeof expected === 'boolean' ? (expected ? 'true' : 'false') : expected;
          if (actualKey !== expectedKey) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) {
          merged = { ...merged, ...css };
        }
      }
    }

    const finalProps: Record<string, unknown> = { ...merged, ...passThrough };

    if (typeof Component === 'string') {
      // Forward the intended element type via `as`, mirroring the web build.
      // Without it the string tag (`styled('button', …)`) is silently dropped
      // and the component collapses to a default Box.
      return createElement(Box, { as: Component, ...finalProps } as BoxProps);
    }
    return createElement(Component, finalProps);
  }

  StyledComponent.displayName =
    typeof Component === 'string'
      ? `styled.${Component}`
      : `styled(${(Component as { displayName?: string; name?: string }).displayName ?? (Component as { name?: string }).name ?? 'Component'})`;

  return StyledComponent;
}

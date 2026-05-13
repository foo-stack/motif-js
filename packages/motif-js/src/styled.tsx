import type { StyleProps } from '@motif-js/core';
import { Box, type BoxProps } from '@motif-js/react';
import type { ComponentType, ElementType, ReactElement } from 'react';
import { createElement } from 'react';

/**
 * Variants config — each entry is one of:
 *
 * - **Explicit** (`size: { sm: { p: '$2' }, md: { p: '$4' } }`) — a record
 *   keyed by enumerated values. The matching prop accepts only those keys.
 * - **Fallback** (`'...size': (val) => ({ p: val })`) — a function that
 *   returns a style bag for any incoming value. Use for "any token in this
 *   scale" cases where enumerating each value would be tedious. Fallback
 *   keys are prefixed with `...`; the rest of the key is the prop name.
 *
 * Both forms can coexist for the same prop name. At runtime the explicit
 * record is checked first; if no key matches and a fallback exists, the
 * fallback function is called with the raw value.
 */
type ExplicitVariant = Record<string, StyleProps>;
type FallbackVariant = (val: never) => StyleProps;
export type AnyVariants = Record<string, ExplicitVariant | FallbackVariant>;

/**
 * Distil the **explicit** prop names from a variants config — keys that
 * do NOT start with `...`.
 */
type ExplicitNames<V> = string &
  {
    [K in keyof V]: K extends `...${string}` ? never : K;
  }[keyof V];

/** Distil the **fallback** prop names — keys starting with `...`, with the
 * prefix stripped. */
type FallbackNames<V> = string &
  {
    [K in keyof V]: K extends `...${infer N}` ? N : never;
  }[keyof V];

type AllVariantNames<V> = ExplicitNames<V> | FallbackNames<V>;

/** Value union for an explicit variant — the keys of its record (with
 * `'true'` / `'false'` widened to `boolean` for ergonomic boolean variants). */
type ExplicitValue<V, K extends string> = K extends keyof V
  ? V[K] extends ExplicitVariant
    ? keyof V[K] extends 'true' | 'false'
      ? boolean
      : keyof V[K]
    : never
  : never;

/** Value type accepted by the fallback function (its first parameter). */
type FallbackValue<V, K extends string> = `...${K}` extends keyof V
  ? V[`...${K}`] extends (val: infer A) => unknown
    ? A
    : never
  : never;

/**
 * Variant prop type derived from a variants config. Each variant name —
 * whether declared with an explicit record, a fallback function, or both —
 * becomes one optional prop whose type is the union of both forms.
 */
export type VariantProps<V extends AnyVariants> = {
  [K in AllVariantNames<V>]?: ExplicitValue<V, K> | FallbackValue<V, K>;
};

/**
 * One entry in `compoundVariants` — a set of variant matchers plus the
 * styles to apply when *all* matchers are satisfied at once. Use for cases
 * like "primary intent at large size gets a heavier weight".
 *
 * Matchers can only target **explicit** variants — fallback values vary
 * over an open set, so compound matching against them is undefined.
 */
export type CompoundVariant<V extends AnyVariants> = {
  [K in keyof V as V[K] extends ExplicitVariant ? K : never]?: V[K] extends ExplicitVariant
    ? keyof V[K] extends 'true' | 'false'
      ? boolean
      : keyof V[K]
    : never;
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
  /** Named groups of style overrides. Mix explicit (`size: { sm, md }`)
   * and fallback (`'...size': (val) => ...`) entries. */
  variants?: V;
  /** Style overrides applied when several **explicit** variant matchers
   * all match at once. Fallback variants cannot participate. */
  compoundVariants?: readonly CompoundVariant<V>[];
  /** Variant values used when the prop is not specified by the caller.
   * Only **explicit** variants can have defaults — fallback values are
   * picked at the call site. */
  defaultVariants?: {
    [K in keyof V as V[K] extends ExplicitVariant ? K : never]?: V[K] extends ExplicitVariant
      ? keyof V[K] extends 'true' | 'false'
        ? boolean
        : keyof V[K]
      : never;
  };
}

/**
 * `styled(Component, config)` returns a new React component that:
 *
 * 1. Reads the variant props out of its incoming props.
 * 2. Resolves `base` + active variants + matching compound variants into a
 *    single merged style-props object.
 * 3. Renders `Component` with the merged style props (plus any pass-through
 *    props the caller supplied).
 *
 * Style props from the caller always override the variant-derived defaults,
 * so a one-off tweak doesn't require authoring a new variant.
 *
 * If `Component` is a string (e.g. `'button'`), the result is rendered via
 * `<Box as="button">` so style props go through the standard pipeline.
 */
export function styled<V extends AnyVariants = Record<string, never>>(
  Component: ElementType,
  config: StyledConfig<V>,
): ComponentType<VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>> {
  // Build the set of all variant prop names (explicit + fallback). The
  // names drive the props-vs-pass-through split during render.
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

    // Layer defaultVariants under the caller-provided values so an
    // omitted prop falls through to the default.
    const effectiveVariants: Record<string, unknown> = {
      ...(config.defaultVariants as Record<string, unknown> | undefined),
      ...variantValues,
    };

    // Build the merged style props, in order:
    //   1. base
    //   2. each active variant (explicit lookup, fallback fn if missed)
    //   3. each matching compoundVariant
    //   4. caller-provided style props (so callers can override anything)
    let merged: StyleProps = { ...config.base };

    for (const variantName of variantNames) {
      const value = effectiveVariants[variantName];
      if (value === undefined) continue;
      const explicit = explicitVariants[variantName];
      const explicitKey = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
      const fromExplicit = explicit?.[explicitKey];
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
      : `styled(${(Component as { displayName?: string; name?: string }).displayName ?? (Component as { name?: string }).name ?? 'Component'})`;

  return StyledComponent;
}

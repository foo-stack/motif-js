import { PSEUDO_ELEMENT_PROP_NAMES, PSEUDO_STATE_PROP_NAMES, type StyleBag } from '@usemotif/core';
import { Box, type BoxProps, useTheme } from '@usemotif/react-native';
import type { ComponentType, ElementType, ReactElement } from 'react';
import { createContext, createElement, useContext } from 'react';
import type { StyledContext, VariantContext } from './styled-context.js';

/**
 * Native build of `@usemotif/react`'s `styled()` factory. Mirrors the
 * web implementation in `./styled.tsx`; the only difference is the
 * underlying Box primitive and `useTheme` come from `@usemotif/react-native`.
 */

type ExplicitVariant = Record<string, StyleBag>;
type FallbackVariant = (val: never, ctx: VariantContext) => StyleBag;
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

/** Tolerates the optional `ctx` second parameter — see `./styled.tsx`. */
type FallbackValue<V, K extends string> = `...${K}` extends keyof V
  ? V[`...${K}`] extends (val: infer A, ...rest: never[]) => unknown
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
  css: StyleBag;
};

export interface StyledConfig<V extends AnyVariants = AnyVariants> {
  base?: StyleBag;
  variants?: V;
  compoundVariants?: readonly CompoundVariant<V>[];
  defaultVariants?: {
    [K in keyof V as V[K] extends ExplicitVariant ? K : never]?: V[K] extends ExplicitVariant
      ? keyof V[K] extends 'true' | 'false'
        ? boolean
        : keyof V[K]
      : never;
  };
  /** A styled context (from `createStyledContext`) — see `./styled.tsx`. */
  context?: StyledContext<Record<string, unknown>>;
}

/** Shared empty context so the consume hook stays unconditional — see web. */
const EMPTY_STYLED_CONTEXT = createContext<Record<string, unknown>>({});

/** Keys whose values are nested style bags and so deep-merge one level across
 * the styled() layers (a variant's `_hover` extends the base's). See web. */
const NESTED_BAG_KEYS: ReadonlySet<string> = new Set<string>([
  ...PSEUDO_STATE_PROP_NAMES,
  ...PSEUDO_ELEMENT_PROP_NAMES,
  'enterStyle',
  'exitStyle',
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Merge `next` onto `into`, deep-merging the nested bag keys; see web. */
function mergeBags(
  into: Record<string, unknown>,
  next: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...into };
  for (const key in next) {
    if (!Object.hasOwn(next, key)) continue;
    const value = next[key];
    const prev = out[key];
    out[key] =
      NESTED_BAG_KEYS.has(key) && isPlainObject(prev) && isPlainObject(value)
        ? { ...prev, ...value }
        : value;
  }
  return out;
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

  const ctxDef = config.context;
  const ctxToRead = ctxDef?.Context ?? EMPTY_STYLED_CONTEXT;
  const needsTheme = Object.keys(fallbackVariants).length > 0;

  function renderStyled(
    props: VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>,
    theme: VariantContext['theme'],
    inherited: Record<string, unknown>,
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

    // defaultVariants < inherited styled-context < caller props (see web).
    const effectiveVariants: Record<string, unknown> = {
      ...(config.defaultVariants as Record<string, unknown> | undefined),
      ...inherited,
      ...variantValues,
    };

    const variantCtx: VariantContext = {
      theme,
      tokens: theme?.tokens,
      props: propsRecord,
    };

    let merged: Record<string, unknown> = { ...config.base };

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
        merged = mergeBags(merged, fromExplicit);
        continue;
      }
      const fallback = fallbackVariants[variantName];
      if (fallback !== undefined) {
        merged = mergeBags(
          merged,
          (fallback as (val: unknown, ctx: VariantContext) => StyleBag)(
            value,
            variantCtx,
          ) as Record<string, unknown>,
        );
      }
    }

    if (config.compoundVariants !== undefined) {
      for (const compound of config.compoundVariants) {
        const { css, ...matchers } = compound as CompoundVariant<V> &
          Record<string, unknown> & {
            css: StyleBag;
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
          merged = mergeBags(merged, css as Record<string, unknown>);
        }
      }
    }

    const finalProps: Record<string, unknown> = mergeBags(merged, passThrough);

    const element =
      typeof Component === 'string'
        ? // Forward the intended element type via `as`, mirroring the web
          // build. Without it the string tag (`styled('button', …)`) is
          // silently dropped and the component collapses to a default Box.
          createElement(Box, { as: Component, ...finalProps } as BoxProps)
        : createElement(Component, finalProps);

    if (ctxDef !== undefined) {
      const provided: Record<string, unknown> = {};
      for (const key of Object.keys(ctxDef.defaults)) {
        const resolved = effectiveVariants[key];
        provided[key] = resolved === undefined ? ctxDef.defaults[key] : resolved;
      }
      return createElement(ctxDef.Provider, { value: provided }, element);
    }
    return element;
  }

  function StyledThemed(
    props: VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>,
  ): ReactElement {
    return renderStyled(props, useTheme(), useContext(ctxToRead));
  }
  function StyledPlain(
    props: VariantProps<V> & Omit<BoxProps, keyof VariantProps<V>>,
  ): ReactElement {
    return renderStyled(props, undefined, useContext(ctxToRead));
  }

  const displayName =
    typeof Component === 'string'
      ? `styled.${Component}`
      : `styled(${(Component as { displayName?: string; name?: string }).displayName ?? (Component as { name?: string }).name ?? 'Component'})`;
  StyledThemed.displayName = displayName;
  StyledPlain.displayName = displayName;

  return needsTheme ? StyledThemed : StyledPlain;
}

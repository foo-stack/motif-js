import {
  STYLE_PROP_NAMES,
  resolveResponsiveStylesToVars,
  type StyleProps,
  type BreakpointName,
} from '@motif-js/core';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { createElement } from 'react';
import { injectAtRules } from './style-cache.js';
import { useActiveCollector } from './collector-context.js';

/**
 * A responsive style-prop value. One of:
 *
 * - Literal value (string / number) — applied unconditionally.
 * - Responsive object — keyed by:
 *   - `base` — unconditional (applied as inline style).
 *   - `<bp>` (e.g. `md`) — applied at `@media (min-width: ...)`.
 *   - `@<bp>` — applied at `@container (min-width: ...)` against the
 *     nearest container ancestor.
 *   - `@<name>.<bp>` — applied at `@container <name> (min-width: ...)`.
 * - Responsive array `[base, sm, md, lg, xl, '2xl']` — positional shorthand
 *   for the object form (media-query keys only). Trailing slots optional.
 */
type Responsive<V> =
  | V
  | ({ base?: V } & { [K in BreakpointName]?: V } & { [K in `@${string}`]?: V })
  | readonly (V | undefined)[];

/**
 * Style props at the React level — every prop also accepts a responsive
 * object containing per-breakpoint overrides.
 */
type ResponsiveStyleProps = {
  -readonly [K in keyof StyleProps]?: Responsive<NonNullable<StyleProps[K]>>;
};

/**
 * Props for the Box primitive.
 *
 * Style props ({@link StyleProps}) accept literal CSS values, `$`-prefixed
 * token references, or responsive objects (`{ base, sm, md, lg, xl }`).
 * Standard HTML attributes (id, data-*, aria-*, event handlers) flow
 * through to the rendered element.
 */
export type BoxProps = ResponsiveStyleProps &
  Omit<HTMLAttributes<HTMLElement>, keyof StyleProps | 'style' | 'children' | 'className'> & {
    /** Render as a different HTML element (defaults to `div`). */
    as?: ElementType;
    /** Extra class name(s) — concatenated with any responsive class motif emits. */
    className?: string;
    /** Inline style overrides — merged on top of the resolved style. */
    style?: CSSProperties;
    /** Content. */
    children?: ReactNode;
  };

/**
 * The atom of motif-js: a styled, theme-aware, responsive container.
 *
 * Token references (`bg="$colors.surface.base"`) emit `var(--…)` strings
 * resolved by the `[data-theme]` cascade.
 * Responsive objects (`p={{ base: '$2', md: '$4' }}`) emit per-breakpoint
 * media queries injected once into a stylesheet and applied via a generated
 * class name.
 */
export function Box(props: BoxProps) {
  const { as = 'div', className: userClassName, style: inlineStyle, children, ...rest } = props;

  // Compiled-output fast path: when the build tool's motif plugin has
  // already extracted every style prop, `rest` carries no style props,
  // so the resolver / class-injection round-trip is pure overhead.
  // Cheap O(rest.keys) early-return keeps the wrapper's runtime cost
  // close to a plain `createElement`.
  if (!hasAnyStyleProp(rest)) {
    return createElement(
      as,
      {
        ...rest,
        ...(userClassName !== undefined && userClassName !== ''
          ? { className: userClassName }
          : {}),
        ...(inlineStyle !== undefined ? { style: inlineStyle } : {}),
      },
      children,
    );
  }

  const {
    baseStyle,
    atRules,
    rest: passThrough,
  } = resolveResponsiveStylesToVars(rest as Record<string, unknown>);

  const activeCollector = useActiveCollector();
  const responsiveClass = injectAtRules(atRules, activeCollector);
  const finalClassName = [responsiveClass, userClassName].filter(Boolean).join(' ') || undefined;

  return createElement(
    as,
    {
      ...passThrough,
      className: finalClassName,
      style: { ...baseStyle, ...inlineStyle } as CSSProperties,
    },
    children,
  );
}

function hasAnyStyleProp(rest: Record<string, unknown>): boolean {
  for (const key in rest) {
    if (STYLE_PROP_NAMES.has(key)) return true;
  }
  return false;
}

import {
  resolveResponsiveStylesToVars,
  type StyleProps,
  type BreakpointName,
} from '@motif-js/core';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { createElement } from 'react';
import { injectMediaRules } from './style-cache.js';

/**
 * A responsive style-prop value: either a literal value (string / number)
 * or a `{ base, sm, md, lg, xl, '2xl' }` object whose entries are applied
 * at each breakpoint.
 */
type Responsive<V> = V | ({ base?: V } & { [K in BreakpointName]?: V });

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

  const {
    baseStyle,
    mediaRules,
    rest: passThrough,
  } = resolveResponsiveStylesToVars(rest as Record<string, unknown>);

  const responsiveClass = injectMediaRules(mediaRules);
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

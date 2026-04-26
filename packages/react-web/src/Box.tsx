import { resolveStyles, type StyleProps } from '@motif-js/core';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { createElement } from 'react';
import { useTheme } from './theme-context.js';

/**
 * Props for the Box primitive.
 *
 * Style props ({@link StyleProps}) accept literal CSS values or `$`-prefixed
 * token references. Standard HTML attributes (id, data-*, aria-*, event
 * handlers) are accepted and passed through to the rendered element.
 */
export type BoxProps = StyleProps &
  Omit<HTMLAttributes<HTMLElement>, keyof StyleProps | 'style' | 'children'> & {
    /** Render as a different HTML element (defaults to `div`). */
    as?: ElementType;
    /** Inline style overrides — merged on top of the resolved style. */
    style?: CSSProperties;
    /** Content. */
    children?: ReactNode;
  };

/**
 * The atom of motif-js: a styled, theme-aware container.
 *
 * Token references in style props (`bg="$colors.surface.base"`) are resolved
 * against the closest `<Theme>` / `<ThemeProvider>` in scope. Without any
 * theme provider, only literal values render — refs silently drop.
 */
export function Box(props: BoxProps) {
  const { as = 'div', className, style: inlineStyle, children, ...rest } = props;
  const theme = useTheme();

  const { style, rest: passThrough } = resolveStyles(rest as Record<string, unknown>, theme);

  return createElement(
    as,
    {
      ...passThrough,
      className,
      style: { ...style, ...inlineStyle } as CSSProperties,
    },
    children,
  );
}

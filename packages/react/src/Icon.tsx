'use client';

import type { ReactElement, ReactNode } from 'react';
import { SVG_PRIMITIVES, Svg, type SvgPrimitives, type SvgProps } from './Svg.js';

/**
 * Icon primitive. A semantic wrapper over `<Svg>` that:
 *
 * - Sets `aria-hidden` by default (icons are decorative unless given
 *   a label). Pass `aria-label` to opt in to a labelled icon, in
 *   which case `role="img"` is set and `aria-hidden` is dropped.
 * - Picks a fixed size from a small token-friendly enum (xs..xl) or
 *   accepts a raw size override.
 *
 * Cross-platform glyphs use the `render` prop and receive the host
 * platform's SVG primitives so the same icon source works on web
 * and on native (with `react-native-svg`):
 *
 * ```tsx
 * <Icon render={({ Line }) => (
 *   <>
 *     <Line x1="12" y1="5" x2="12" y2="19" />
 *     <Line x1="5" y1="12" x2="19" y2="12" />
 *   </>
 * )} />
 * ```
 *
 * `children` are still accepted for legacy / web-only icons; the
 * `@usemotif/icons` package uses the `render` form so its glyphs
 * work on both platforms.
 */
export interface IconProps extends Omit<SvgProps, 'size' | 'children'> {
  /** Size token. Maps to a pixel value. Defaults to `'md'` (20px). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Decorative icons are hidden from a11y. Set `aria-label` to opt in. */
  'aria-label'?: string;
  /** Render-prop receiving the platform's SVG primitives. */
  render?: (primitives: SvgPrimitives) => ReactNode;
  children?: ReactNode;
}

const SIZE_PX: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({ size = 'md', render, children, ...rest }: IconProps): ReactElement {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const label = rest['aria-label'];
  const labelled = typeof label === 'string' && label.length > 0;
  const content = render !== undefined ? render(SVG_PRIMITIVES) : children;
  return (
    <Svg
      size={px}
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      {...rest}
    >
      {content}
    </Svg>
  );
}

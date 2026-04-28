'use client';

import type { ReactElement, ReactNode } from 'react';
import { Svg, type SvgProps } from './Svg.js';

/**
 * Icon primitive. A semantic wrapper over `<Svg>` that:
 *
 * - Sets `aria-hidden` by default (icons are decorative unless given
 *   a label). Pass `aria-label` to opt in to a labelled icon, in
 *   which case `role="img"` is set and `aria-hidden` is dropped.
 * - Picks a fixed size from a small token-friendly enum (xs..xl) or
 *   accepts a raw size override.
 *
 * Composes with motif primitives: pass children that are SVG
 * elements (`<path>`, `<circle>`, etc.). The `@motif-js/icons`
 * package ships pre-built Icons for common glyphs.
 */
export interface IconProps extends Omit<SvgProps, 'size'> {
  /** Size token. Maps to a pixel value. Defaults to `'md'` (20px). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Decorative icons are hidden from a11y. Set `aria-label` to opt in. */
  'aria-label'?: string;
  children?: ReactNode;
}

const SIZE_PX: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({ size = 'md', children, ...rest }: IconProps): ReactElement {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const label = rest['aria-label'];
  const labelled = typeof label === 'string' && label.length > 0;
  return (
    <Svg
      size={px}
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      {...rest}
    >
      {children}
    </Svg>
  );
}

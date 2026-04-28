'use client';

import type { ReactElement, ReactNode, SVGAttributes } from 'react';

/**
 * SVG primitive — a thin pass-through that gives motif a typed
 * surface for rendering inline SVGs. Default size is `1em` so SVGs
 * scale with their parent's `font-size` (which is what icon-set
 * conventions assume).
 *
 * The component does NOT carry the motif style-prop schema directly
 * — SVG attributes (`viewBox`, `fill`, `stroke`, etc.) are rich
 * enough that mixing them with the style-prop layer would be more
 * confusing than helpful. Use `style={{ ... }}` for CSS that needs
 * to land on the `<svg>` element itself.
 */
export interface SvgProps extends SVGAttributes<SVGSVGElement> {
  /** Width override. Defaults to `1em` (scales with parent font-size). */
  size?: number | string;
  children?: ReactNode;
}
export function Svg({ size = '1em', width, height, children, ...rest }: SvgProps): ReactElement {
  const w = width ?? size;
  const h = height ?? size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox={rest.viewBox ?? '0 0 24 24'}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

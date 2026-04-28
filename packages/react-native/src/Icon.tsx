import type { ReactElement, ReactNode } from 'react';
import { SVG_PRIMITIVES, Svg, type SvgPrimitives, type SvgProps } from './Svg.js';

export interface IconProps extends Omit<SvgProps, 'size' | 'children'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  accessibilityLabel?: string;
  /**
   * Render-prop receiving the platform's SVG primitives (Path, Line,
   * Circle, …). On native this is `null` when `react-native-svg` isn't
   * installed; in that case `Icon` renders a sized `Box` placeholder.
   */
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
  // When react-native-svg is installed, hand the render prop the
  // platform primitives. When it isn't, drop to children (which are
  // typically nothing for icon glyphs that use the render prop) so
  // the fallback Box renders empty rather than throwing on unknown
  // host components.
  const content =
    render !== undefined && SVG_PRIMITIVES !== null ? render(SVG_PRIMITIVES) : children;
  return (
    <Svg size={px} {...rest}>
      {content}
    </Svg>
  );
}

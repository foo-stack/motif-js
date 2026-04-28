import type { ReactElement, ReactNode } from 'react';
import { Svg, type SvgProps } from './Svg.js';

export interface IconProps extends Omit<SvgProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  accessibilityLabel?: string;
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
  return (
    <Svg size={px} {...rest}>
      {children}
    </Svg>
  );
}

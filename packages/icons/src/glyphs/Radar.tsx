import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Radar(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
          <Path d="M4 6h.01" />
          <Path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
          <Path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
          <Path d="M12 18h.01" />
          <Path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
          <Circle cx="12" cy="12" r="2" />
          <Path d="m13.41 10.59 5.66-5.66" />
        </>
      )}
    />
  );
}

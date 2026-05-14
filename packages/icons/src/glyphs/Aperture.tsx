import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Aperture(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="m14.31 8 5.74 9.94" />
          <Path d="M9.69 8h11.48" />
          <Path d="m7.38 12 5.74-9.94" />
          <Path d="M9.69 16 3.95 6.06" />
          <Path d="M14.31 16H2.83" />
          <Path d="m16.62 12-5.74 9.94" />
        </>
      )}
    />
  );
}

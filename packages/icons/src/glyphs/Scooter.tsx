import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Scooter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M21 4h-3.5l2 11.05" />
          <Path d="M6.95 17h5.142c.523 0 .95-.406 1.063-.916a6.5 6.5 0 0 1 5.345-5.009" />
          <Circle cx="19.5" cy="17.5" r="2.5" />
          <Circle cx="4.5" cy="17.5" r="2.5" />
        </>
      )}
    />
  );
}

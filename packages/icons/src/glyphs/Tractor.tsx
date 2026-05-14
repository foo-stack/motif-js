import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Tractor(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" />
          <Path d="M16 18h-5" />
          <Path d="M18 5a1 1 0 0 0-1 1v5.573" />
          <Path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" />
          <Path d="M4 11V4" />
          <Path d="M7 15h.01" />
          <Path d="M8 10.1V4" />
          <Circle cx="18" cy="18" r="2" />
          <Circle cx="7" cy="15" r="5" />
        </>
      )}
    />
  );
}

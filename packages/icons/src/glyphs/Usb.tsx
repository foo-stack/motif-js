import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Usb(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="10" cy="7" r="1" />
          <Circle cx="4" cy="20" r="1" />
          <Path d="M4.7 19.3 19 5" />
          <Path d="m21 3-3 1 2 2Z" />
          <Path d="M9.26 7.68 5 12l2 5" />
          <Path d="m10 14 5 2 3.5-3.5" />
          <Path d="m18 12 1-1 1 1-1 1Z" />
        </>
      )}
    />
  );
}

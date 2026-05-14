import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function NavigationOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M8.43 8.43 3 11l8 2 2 8 2.57-5.43" />
          <Path d="M17.39 11.73 22 2l-9.73 4.61" />
          <Line x1="2" x2="22" y1="2" y2="22" />
        </>
      )}
    />
  );
}

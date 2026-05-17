import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function EggOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m2 2 20 20" />
          <Path d="M20 14.347V14c0-6-4-12-8-12-1.078 0-2.157.436-3.157 1.19" />
          <Path d="M6.206 6.21C4.871 8.4 4 11.2 4 14a8 8 0 0 0 14.568 4.568" />
        </>
      )}
    />
  );
}

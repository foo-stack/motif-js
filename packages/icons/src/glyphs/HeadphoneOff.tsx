import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function HeadphoneOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 14h-1.343" />
          <Path d="M9.128 3.47A9 9 0 0 1 21 12v3.343" />
          <Path d="m2 2 20 20" />
          <Path d="M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3" />
          <Path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364" />
        </>
      )}
    />
  );
}

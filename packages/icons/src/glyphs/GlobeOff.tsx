import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GlobeOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10.114 4.462A14.5 14.5 0 0 1 12 2a10 10 0 0 1 9.313 13.643" />
          <Path d="M15.557 15.556A14.5 14.5 0 0 1 12 22 10 10 0 0 1 4.929 4.929" />
          <Path d="M15.892 10.234A14.5 14.5 0 0 0 12 2a10 10 0 0 0-3.643.687" />
          <Path d="M17.656 12H22" />
          <Path d="M19.071 19.071A10 10 0 0 1 12 22 14.5 14.5 0 0 1 8.44 8.45" />
          <Path d="M2 12h10" />
          <Path d="m2 2 20 20" />
        </>
      )}
    />
  );
}

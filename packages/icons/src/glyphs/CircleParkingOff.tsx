import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleParkingOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12.656 7H13a3 3 0 0 1 2.984 3.307" />
          <Path d="M13 13H9" />
          <Path d="M19.071 19.071A1 1 0 0 1 4.93 4.93" />
          <Path d="m2 2 20 20" />
          <Path d="M8.357 2.687a10 10 0 0 1 12.956 12.956" />
          <Path d="M9 17V9" />
        </>
      )}
    />
  );
}

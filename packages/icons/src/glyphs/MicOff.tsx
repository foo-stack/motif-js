import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MicOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 19v3" />
          <Path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
          <Path d="M16.95 16.95A7 7 0 0 1 5 12v-2" />
          <Path d="M18.89 13.23A7 7 0 0 0 19 12v-2" />
          <Path d="m2 2 20 20" />
          <Path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
        </>
      )}
    />
  );
}

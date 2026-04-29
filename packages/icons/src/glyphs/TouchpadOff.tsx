import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TouchpadOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 20v-6" />
          <Path d="M19.656 14H22" />
          <Path d="M2 14h12" />
          <Path d="m2 2 20 20" />
          <Path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" />
          <Path d="M9.656 4H20a2 2 0 0 1 2 2v10.344" />
        </>
      )}
    />
  );
}

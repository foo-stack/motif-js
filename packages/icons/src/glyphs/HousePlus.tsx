import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HousePlus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35" />
          <Path d="M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
          <Path d="M15 18h6" />
          <Path d="M18 15v6" />
        </>
      )}
    />
  );
}

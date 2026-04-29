import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Save(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <Path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
          <Path d="M7 3v4a1 1 0 0 0 1 1h7" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cable(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z" />
          <Path d="M17 21v-2" />
          <Path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10" />
          <Path d="M21 21v-2" />
          <Path d="M3 5V3" />
          <Path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z" />
          <Path d="M7 5V3" />
        </>
      )}
    />
  );
}

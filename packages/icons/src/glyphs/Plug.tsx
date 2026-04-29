import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Plug(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 22v-5" />
          <Path d="M15 8V2" />
          <Path d="M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z" />
          <Path d="M9 8V2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Minimize(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <Path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <Path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <Path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </>
      )}
    />
  );
}

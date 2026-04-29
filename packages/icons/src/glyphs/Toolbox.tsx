import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Toolbox(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 12v4" />
          <Path d="M16 6a2 2 0 0 1 1.414.586l4 4A2 2 0 0 1 22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 .586-1.414l4-4A2 2 0 0 1 8 6z" />
          <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <Path d="M2 14h20" />
          <Path d="M8 12v4" />
        </>
      )}
    />
  );
}

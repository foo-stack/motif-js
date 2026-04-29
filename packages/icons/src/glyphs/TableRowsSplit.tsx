import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TableRowsSplit(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14 10h2" />
          <Path d="M15 22v-8" />
          <Path d="M15 2v4" />
          <Path d="M2 10h2" />
          <Path d="M20 10h2" />
          <Path d="M3 19h18" />
          <Path d="M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6" />
          <Path d="M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2" />
          <Path d="M8 10h2" />
          <Path d="M9 22v-8" />
          <Path d="M9 2v4" />
        </>
      )}
    />
  );
}

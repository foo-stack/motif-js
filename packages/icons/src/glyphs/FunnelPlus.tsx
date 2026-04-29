import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FunnelPlus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348" />
          <Path d="M16 6h6" />
          <Path d="M19 3v6" />
        </>
      )}
    />
  );
}

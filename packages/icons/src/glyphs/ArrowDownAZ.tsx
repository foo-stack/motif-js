import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowDownAZ(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m3 16 4 4 4-4" />
          <Path d="M7 20V4" />
          <Path d="M20 8h-5" />
          <Path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10" />
          <Path d="M15 14h5l-5 6h5" />
        </>
      )}
    />
  );
}

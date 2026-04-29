import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ScanHeart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <Path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 4.172 4.306l-3.447 3.62a1 1 0 0 1-1.449 0z" />
        </>
      )}
    />
  );
}

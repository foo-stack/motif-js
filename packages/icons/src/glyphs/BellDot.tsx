import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BellDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <Path d="M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348" />
          <Circle cx="18" cy="5" r="3" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RefreshCcw(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polyline, Path }) => (
        <>
          <Polyline points="1 4 1 10 7 10" />
          <Polyline points="23 20 23 14 17 14" />
          <Path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BluetoothConnected(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="m7 7 10 10-5 5V2l5 5L7 17" />
          <Line x1="18" x2="21" y1="12" y2="12" />
          <Line x1="3" x2="6" y1="12" y2="12" />
        </>
      )}
    />
  );
}

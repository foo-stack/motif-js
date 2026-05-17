import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function BluetoothOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m17 17-5 5V12l-5 5" />
          <Path d="m2 2 20 20" />
          <Path d="M14.5 9.5 17 7l-5-5v4.5" />
        </>
      )}
    />
  );
}

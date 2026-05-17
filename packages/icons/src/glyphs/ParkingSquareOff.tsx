import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ParkingSquareOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41" />
          <Path d="M3 8.7V19a2 2 0 0 0 2 2h10.3" />
          <Path d="m2 2 20 20" />
          <Path d="M13 13a3 3 0 1 0 0-6H9v2" />
          <Path d="M9 17v-2.3" />
        </>
      )}
    />
  );
}

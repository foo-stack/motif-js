import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ParkingCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </>
      )}
    />
  );
}

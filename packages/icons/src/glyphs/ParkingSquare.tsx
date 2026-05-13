import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ParkingSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </>
      )}
    />
  );
}

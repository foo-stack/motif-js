import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleDollarSign(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <Path d="M12 18V6" />
        </>
      )}
    />
  );
}

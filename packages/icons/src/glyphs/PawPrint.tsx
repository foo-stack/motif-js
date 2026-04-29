import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PawPrint(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="11" cy="4" r="2" />
          <Circle cx="18" cy="8" r="2" />
          <Circle cx="20" cy="16" r="2" />
          <Path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
        </>
      )}
    />
  );
}

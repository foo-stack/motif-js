import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Antenna(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 12 7 2" />
          <Path d="m7 12 5-10" />
          <Path d="m12 12 5-10" />
          <Path d="m17 12 5-10" />
          <Path d="M4.5 7h15" />
          <Path d="M12 16v6" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SolarPanel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 2h2" />
          <Path d="m14.28 14-4.56 8" />
          <Path d="m21 22-1.558-4H4.558" />
          <Path d="M3 10v2" />
          <Path d="M6.245 15.04A2 2 0 0 1 8 14h12a1 1 0 0 1 .864 1.505l-3.11 5.457A2 2 0 0 1 16 22H4a1 1 0 0 1-.863-1.506z" />
          <Path d="M7 2a4 4 0 0 1-4 4" />
          <Path d="m8.66 7.66 1.41 1.41" />
        </>
      )}
    />
  );
}

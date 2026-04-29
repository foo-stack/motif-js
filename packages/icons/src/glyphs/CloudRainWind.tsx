import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudRainWind(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <Path d="m9.2 22 3-7" />
          <Path d="m9 13-3 7" />
          <Path d="m17 13-3 7" />
        </>
      )}
    />
  );
}

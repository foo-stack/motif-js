import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CloudSun(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v2" />
          <Path d="m4.93 4.93 1.41 1.41" />
          <Path d="M20 12h2" />
          <Path d="m19.07 4.93-1.41 1.41" />
          <Path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
          <Path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
        </>
      )}
    />
  );
}

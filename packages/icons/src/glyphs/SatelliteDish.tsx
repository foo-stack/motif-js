import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SatelliteDish(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 10a7.31 7.31 0 0 0 10 10Z" />
          <Path d="m9 15 3-3" />
          <Path d="M17 13a6 6 0 0 0-6-6" />
          <Path d="M21 13A10 10 0 0 0 11 3" />
        </>
      )}
    />
  );
}

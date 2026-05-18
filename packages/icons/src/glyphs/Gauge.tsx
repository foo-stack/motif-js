import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Gauge(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m12 14 4-4" />
          <Path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </>
      )}
    />
  );
}

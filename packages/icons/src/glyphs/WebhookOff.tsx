import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function WebhookOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15" />
          <Path d="M9 3.4a4 4 0 0 1 6.52.66" />
          <Path d="m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05" />
          <Path d="M20.3 20.3a4 4 0 0 1-2.3.7" />
          <Path d="M18.6 13a4 4 0 0 1 3.357 3.414" />
          <Path d="m12 6 .6 1" />
          <Path d="m2 2 20 20" />
        </>
      )}
    />
  );
}

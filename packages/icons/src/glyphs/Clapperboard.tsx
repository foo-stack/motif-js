import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Clapperboard(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m12.296 3.464 3.02 3.956" />
          <Path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z" />
          <Path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <Path d="m6.18 5.276 3.1 3.899" />
        </>
      )}
    />
  );
}

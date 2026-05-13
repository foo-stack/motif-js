import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LandPlot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m12 8 6-3-6-3v10" />
          <Path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
          <Path d="m6.49 12.85 11.02 6.3" />
          <Path d="M17.51 12.85 6.5 19.15" />
        </>
      )}
    />
  );
}

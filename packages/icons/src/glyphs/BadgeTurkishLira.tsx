import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BadgeTurkishLira(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 7v10a5 5 0 0 0 5-5" />
          <Path d="m15 8-6 3" />
          <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" />
        </>
      )}
    />
  );
}

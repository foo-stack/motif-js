import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ZodiacScorpio(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 19V5.5a1 1 0 0 1 5 0V17a2 2 0 0 0 2 2h5l-3-3" />
          <Path d="m22 19-3 3" />
          <Path d="M5 19V5.5a1 1 0 0 1 5 0" />
          <Path d="M5 5.5A2.5 2.5 0 0 0 2.5 3" />
        </>
      )}
    />
  );
}

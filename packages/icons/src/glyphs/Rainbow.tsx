import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Rainbow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M22 17a10 10 0 0 0-20 0" />
          <Path d="M6 17a6 6 0 0 1 12 0" />
          <Path d="M10 17a2 2 0 0 1 4 0" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function EyeClosed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 18-.722-3.25" />
          <Path d="M2 8a10.645 10.645 0 0 0 20 0" />
          <Path d="m20 15-1.726-2.05" />
          <Path d="m4 15 1.726-2.05" />
          <Path d="m9 18 .722-3.25" />
        </>
      )}
    />
  );
}

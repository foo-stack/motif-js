import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Vote(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m9 12 2 2 4-4" />
          <Path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
          <Path d="M22 19H2" />
        </>
      )}
    />
  );
}

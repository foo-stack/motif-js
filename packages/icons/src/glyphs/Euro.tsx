import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Euro(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 10h12" />
          <Path d="M4 14h9" />
          <Path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Wind(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
          <Path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
          <Path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
        </>
      )}
    />
  );
}

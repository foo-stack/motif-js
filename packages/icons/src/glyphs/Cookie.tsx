import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Cookie(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
          <Path d="M8.5 8.5v.01" />
          <Path d="M16 15.5v.01" />
          <Path d="M12 12v.01" />
          <Path d="M11 17v.01" />
          <Path d="M7 14v.01" />
        </>
      )}
    />
  );
}

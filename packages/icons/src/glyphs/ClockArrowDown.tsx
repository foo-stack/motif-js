import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ClockArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 6v6l2 1" />
          <Path d="M12.337 21.994a10 10 0 1 1 9.588-8.767" />
          <Path d="m14 18 4 4 4-4" />
          <Path d="M18 14v8" />
        </>
      )}
    />
  );
}

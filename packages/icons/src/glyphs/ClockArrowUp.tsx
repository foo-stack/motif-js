import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ClockArrowUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 6v6l1.56.78" />
          <Path d="M13.227 21.925a10 10 0 1 1 8.767-9.588" />
          <Path d="m14 18 4-4 4 4" />
          <Path d="M18 22v-8" />
        </>
      )}
    />
  );
}

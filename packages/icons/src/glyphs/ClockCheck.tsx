import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ClockCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 6v6l4 2" />
          <Path d="M22 12a10 10 0 1 0-11 9.95" />
          <Path d="m22 16-5.5 5.5L14 19" />
        </>
      )}
    />
  );
}

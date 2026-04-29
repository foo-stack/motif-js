import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LampFloor(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 10v12" />
          <Path d="M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z" />
          <Path d="M9 22h6" />
        </>
      )}
    />
  );
}

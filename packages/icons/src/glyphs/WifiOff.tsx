import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WifiOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 20h.01" />
          <Path d="M8.5 16.429a5 5 0 0 1 7 0" />
          <Path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
          <Path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
          <Path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
          <Path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
          <Path d="m2 2 20 20" />
        </>
      )}
    />
  );
}

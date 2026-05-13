import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Wifi(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 20h.01" />
          <Path d="M2 8.82a15 15 0 0 1 20 0" />
          <Path d="M5 12.859a10 10 0 0 1 14 0" />
          <Path d="M8.5 16.429a5 5 0 0 1 7 0" />
        </>
      )}
    />
  );
}

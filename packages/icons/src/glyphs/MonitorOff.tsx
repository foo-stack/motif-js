import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MonitorOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 17v4" />
          <Path d="M17 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 1.184-1.826" />
          <Path d="m2 2 20 20" />
          <Path d="M8 21h8" />
          <Path d="M8.656 3H20a2 2 0 0 1 2 2v10a2 2 0 0 1-.293 1.042" />
        </>
      )}
    />
  );
}

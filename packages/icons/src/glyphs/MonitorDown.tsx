import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MonitorDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 13V7" />
          <Path d="m15 10-3 3-3-3" />
          <Rect width="20" height="14" x="2" y="3" rx="2" />
          <Path d="M12 17v4" />
          <Path d="M8 21h8" />
        </>
      )}
    />
  );
}

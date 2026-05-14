import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MonitorStop(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 17v4" />
          <Path d="M8 21h8" />
          <Rect x="2" y="3" width="20" height="14" rx="2" />
          <Rect x="9" y="7" width="6" height="6" rx="1" />
        </>
      )}
    />
  );
}

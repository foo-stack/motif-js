import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorCloud(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M11 13a3 3 0 1 1 2.83-4H14a2 2 0 0 1 0 4z" />
          <Path d="M12 17v4" />
          <Path d="M8 21h8" />
          <Rect x="2" y="3" width="20" height="14" rx="2" />
        </>
      )}
    />
  );
}

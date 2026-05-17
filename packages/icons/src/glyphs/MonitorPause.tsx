import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function MonitorPause(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 13V7" />
          <Path d="M14 13V7" />
          <Rect width="20" height="14" x="2" y="3" rx="2" />
          <Path d="M12 17v4" />
          <Path d="M8 21h8" />
        </>
      )}
    />
  );
}

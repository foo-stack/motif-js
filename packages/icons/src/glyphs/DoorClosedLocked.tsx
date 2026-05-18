import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function DoorClosedLocked(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 12h.01" />
          <Path d="M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
          <Path d="M2 20h8" />
          <Path d="M20 17v-2a2 2 0 1 0-4 0v2" />
          <Rect x="14" y="17" width="8" height="5" rx="1" />
        </>
      )}
    />
  );
}

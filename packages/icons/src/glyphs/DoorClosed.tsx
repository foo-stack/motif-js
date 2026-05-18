import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function DoorClosed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 12h.01" />
          <Path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
          <Path d="M2 20h20" />
        </>
      )}
    />
  );
}

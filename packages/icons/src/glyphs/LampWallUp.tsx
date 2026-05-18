import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function LampWallUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19.929 9.629A1 1 0 0 1 19 11H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 4h6a1 1 0 0 1 .928.629z" />
          <Path d="M6 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
          <Path d="M8 18h4a2 2 0 0 0 2-2v-5" />
        </>
      )}
    />
  );
}

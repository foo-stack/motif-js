import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Ruler(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
          <Path d="m14.5 12.5 2-2" />
          <Path d="m11.5 9.5 2-2" />
          <Path d="m8.5 6.5 2-2" />
          <Path d="m17.5 15.5 2-2" />
        </>
      )}
    />
  );
}

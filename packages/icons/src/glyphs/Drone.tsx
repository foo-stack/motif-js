import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Drone(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 10 7 7" />
          <Path d="m10 14-3 3" />
          <Path d="m14 10 3-3" />
          <Path d="m14 14 3 3" />
          <Path d="M14.205 4.139a4 4 0 1 1 5.439 5.863" />
          <Path d="M19.637 14a4 4 0 1 1-5.432 5.868" />
          <Path d="M4.367 10a4 4 0 1 1 5.438-5.862" />
          <Path d="M9.795 19.862a4 4 0 1 1-5.429-5.873" />
          <Rect x="10" y="8" width="4" height="8" rx="1" />
        </>
      )}
    />
  );
}

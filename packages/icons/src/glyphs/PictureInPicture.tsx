import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PictureInPicture(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M2 10h6V4" />
          <Path d="m2 4 6 6" />
          <Path d="M21 10V7a2 2 0 0 0-2-2h-7" />
          <Path d="M3 14v2a2 2 0 0 0 2 2h3" />
          <Rect x="12" y="14" width="10" height="7" rx="1" />
        </>
      )}
    />
  );
}

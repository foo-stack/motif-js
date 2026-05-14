import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PictureInPicture2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4" />
          <Rect width="10" height="7" x="12" y="13" rx="2" />
        </>
      )}
    />
  );
}

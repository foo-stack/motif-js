import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GalleryVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M3 2h18" />
          <Rect width="18" height="12" x="3" y="6" rx="2" />
          <Path d="M3 22h18" />
        </>
      )}
    />
  );
}

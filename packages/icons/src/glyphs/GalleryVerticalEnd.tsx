import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GalleryVerticalEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M7 2h10" />
          <Path d="M5 6h14" />
          <Rect width="18" height="12" x="3" y="10" rx="2" />
        </>
      )}
    />
  );
}

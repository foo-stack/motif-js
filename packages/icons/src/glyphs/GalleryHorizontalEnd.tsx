import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GalleryHorizontalEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M2 7v10" />
          <Path d="M6 5v14" />
          <Rect width="12" height="18" x="10" y="3" rx="2" />
        </>
      )}
    />
  );
}

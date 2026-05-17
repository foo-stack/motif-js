import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function GalleryHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M2 3v18" />
          <Rect width="12" height="18" x="6" y="3" rx="2" />
          <Path d="M22 3v18" />
        </>
      )}
    />
  );
}

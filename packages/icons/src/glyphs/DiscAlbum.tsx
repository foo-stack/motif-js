import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function DiscAlbum(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Circle cx="12" cy="12" r="5" />
          <Path d="M12 12h.01" />
        </>
      )}
    />
  );
}

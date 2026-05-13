import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ImageUpscale(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M16 3h5v5" />
          <Path d="M17 21h2a2 2 0 0 0 2-2" />
          <Path d="M21 12v3" />
          <Path d="m21 3-5 5" />
          <Path d="M3 7V5a2 2 0 0 1 2-2" />
          <Path d="m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19" />
          <Path d="M9 3h3" />
          <Rect x="3" y="11" width="10" height="10" rx="1" />
        </>
      )}
    />
  );
}

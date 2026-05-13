import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CopyPlus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path, Rect }) => (
        <>
          <Line x1="15" x2="15" y1="12" y2="18" />
          <Line x1="12" x2="18" y1="15" y2="15" />
          <Rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </>
      )}
    />
  );
}

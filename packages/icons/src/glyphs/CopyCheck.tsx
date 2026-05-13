import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CopyCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m12 15 2 2 4-4" />
          <Rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </>
      )}
    />
  );
}

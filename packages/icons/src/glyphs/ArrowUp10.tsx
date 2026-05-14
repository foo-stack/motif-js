import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowUp10(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m3 8 4-4 4 4" />
          <Path d="M7 4v16" />
          <Path d="M17 10V4h-2" />
          <Path d="M15 10h4" />
          <Rect x="15" y="14" width="4" height="6" ry="2" />
        </>
      )}
    />
  );
}

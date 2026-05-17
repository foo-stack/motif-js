import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowDown10(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m3 16 4 4 4-4" />
          <Path d="M7 20V4" />
          <Path d="M17 10V4h-2" />
          <Path d="M15 10h4" />
          <Rect x="15" y="14" width="4" height="6" ry="2" />
        </>
      )}
    />
  );
}

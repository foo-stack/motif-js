import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowDown01(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m3 16 4 4 4-4" />
          <Path d="M7 20V4" />
          <Rect x="15" y="4" width="4" height="6" ry="2" />
          <Path d="M17 20v-6h-2" />
          <Path d="M15 20h4" />
        </>
      )}
    />
  );
}

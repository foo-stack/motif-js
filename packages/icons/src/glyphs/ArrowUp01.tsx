import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowUp01(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m3 8 4-4 4 4" />
          <Path d="M7 4v16" />
          <Rect x="15" y="4" width="4" height="6" ry="2" />
          <Path d="M17 20v-6h-2" />
          <Path d="M15 20h4" />
        </>
      )}
    />
  );
}

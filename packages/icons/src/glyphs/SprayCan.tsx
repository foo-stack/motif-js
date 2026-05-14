import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SprayCan(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M3 3h.01" />
          <Path d="M7 5h.01" />
          <Path d="M11 7h.01" />
          <Path d="M3 7h.01" />
          <Path d="M7 9h.01" />
          <Path d="M3 11h.01" />
          <Rect width="4" height="4" x="15" y="5" />
          <Path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" />
          <Path d="m13 14 8-2" />
          <Path d="m13 19 8-2" />
        </>
      )}
    />
  );
}

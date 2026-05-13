import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Combine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" />
          <Path d="M19 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" />
          <Path d="m7 15 3 3" />
          <Path d="m7 21 3-3H5a2 2 0 0 1-2-2v-2" />
          <Rect x="14" y="14" width="7" height="7" rx="1" />
          <Rect x="3" y="3" width="7" height="7" rx="1" />
        </>
      )}
    />
  );
}

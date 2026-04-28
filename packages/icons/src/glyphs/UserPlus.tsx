import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserPlus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle, Line }) => (
        <>
          <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <Circle cx="8.5" cy="7" r="4" />
          <Line x1="20" y1="8" x2="20" y2="14" />
          <Line x1="23" y1="11" x2="17" y2="11" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LogOut(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline, Line }) => (
        <>
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <Polyline points="16 17 21 12 16 7" />
          <Line x1="21" y1="12" x2="9" y2="12" />
        </>
      )}
    />
  );
}

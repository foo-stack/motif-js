import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LogIn(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline, Line }) => (
        <>
          <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <Polyline points="10 17 15 12 10 7" />
          <Line x1="15" y1="12" x2="3" y2="12" />
        </>
      )}
    />
  );
}

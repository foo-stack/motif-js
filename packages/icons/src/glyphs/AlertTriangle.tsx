import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlertTriangle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Line }) => (
        <>
          <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <Line x1="12" y1="9" x2="12" y2="13" />
          <Line x1="12" y1="17" x2="12.01" y2="17" />
        </>
      )}
    />
  );
}

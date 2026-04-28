import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Upload(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline, Line }) => (
        <>
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <Polyline points="17 8 12 3 7 8" />
          <Line x1="12" y1="3" x2="12" y2="15" />
        </>
      )}
    />
  );
}

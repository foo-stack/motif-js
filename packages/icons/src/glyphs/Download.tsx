import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Download(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline, Line }) => (
        <>
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <Polyline points="7 10 12 15 17 10" />
          <Line x1="12" y1="15" x2="12" y2="3" />
        </>
      )}
    />
  );
}

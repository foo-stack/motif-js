import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ExternalLink(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline, Line }) => (
        <>
          <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <Polyline points="15 3 21 3 21 9" />
          <Line x1="10" y1="14" x2="21" y2="3" />
        </>
      )}
    />
  );
}

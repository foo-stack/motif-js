import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Radical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21" />
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Swords(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Polyline }) => (
        <>
          <Polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <Line x1="13" x2="19" y1="19" y2="13" />
          <Line x1="16" x2="20" y1="16" y2="20" />
          <Line x1="19" x2="21" y1="21" y2="19" />
          <Polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
          <Line x1="5" x2="9" y1="14" y2="18" />
          <Line x1="7" x2="4" y1="17" y2="20" />
          <Line x1="3" x2="5" y1="19" y2="21" />
        </>
      )}
    />
  );
}

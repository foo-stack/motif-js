import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Polyline }) => (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" />
          <Polyline points="19 12 12 19 5 12" />
        </>
      )}
    />
  );
}

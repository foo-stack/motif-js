import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Polyline }) => (
        <>
          <Line x1="12" y1="19" x2="12" y2="5" />
          <Polyline points="5 12 12 5 19 12" />
        </>
      )}
    />
  );
}

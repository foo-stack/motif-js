import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Polyline }) => (
        <>
          <Line x1="5" y1="12" x2="19" y2="12" />
          <Polyline points="12 5 19 12 12 19" />
        </>
      )}
    />
  );
}

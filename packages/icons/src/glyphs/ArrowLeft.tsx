import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Polyline }) => (
        <>
          <Line x1="19" y1="12" x2="5" y2="12" />
          <Polyline points="12 19 5 12 12 5" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Terminal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polyline, Line }) => (
        <>
          <Polyline points="4 17 10 11 4 5" />
          <Line x1="12" y1="19" x2="20" y2="19" />
        </>
      )}
    />
  );
}

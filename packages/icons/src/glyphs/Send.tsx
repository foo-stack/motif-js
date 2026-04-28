import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Send(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Polygon }) => (
        <>
          <Line x1="22" y1="2" x2="11" y2="13" />
          <Polygon points="22 2 15 22 11 13 2 9 22 2" />
        </>
      )}
    />
  );
}

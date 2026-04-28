import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function VolumeX(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polygon, Line }) => (
        <>
          <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <Line x1="23" y1="9" x2="17" y2="15" />
          <Line x1="17" y1="9" x2="23" y2="15" />
        </>
      )}
    />
  );
}

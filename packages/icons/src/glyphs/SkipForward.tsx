import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SkipForward(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polygon, Line }) => (
        <>
          <Polygon points="5 4 15 12 5 20 5 4" />
          <Line x1="19" y1="5" x2="19" y2="19" />
        </>
      )}
    />
  );
}

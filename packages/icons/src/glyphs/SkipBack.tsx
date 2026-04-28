import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SkipBack(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polygon, Line }) => (
        <>
          <Polygon points="19 20 9 12 19 4 19 20" />
          <Line x1="5" y1="19" x2="5" y2="5" />
        </>
      )}
    />
  );
}

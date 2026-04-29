import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ZoomOut(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="11" cy="11" r="8" />
          <Line x1="21" x2="16.65" y1="21" y2="16.65" />
          <Line x1="8" x2="14" y1="11" y2="11" />
        </>
      )}
    />
  );
}

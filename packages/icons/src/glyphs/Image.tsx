import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Image(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect, Circle, Polyline }) => (
        <>
          <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <Circle cx="8.5" cy="8.5" r="1.5" />
          <Polyline points="21 15 16 10 5 21" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Calendar(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect, Line }) => (
        <>
          <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <Line x1="16" y1="2" x2="16" y2="6" />
          <Line x1="8" y1="2" x2="8" y2="6" />
          <Line x1="3" y1="10" x2="21" y2="10" />
        </>
      )}
    />
  );
}

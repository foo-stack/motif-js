import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Sheet(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Line x1="3" x2="21" y1="9" y2="9" />
          <Line x1="3" x2="21" y1="15" y2="15" />
          <Line x1="9" x2="9" y1="9" y2="21" />
          <Line x1="15" x2="15" y1="9" y2="21" />
        </>
      )}
    />
  );
}

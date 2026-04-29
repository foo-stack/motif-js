import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Tablet(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <Line x1="12" x2="12.01" y1="18" y2="18" />
        </>
      )}
    />
  );
}

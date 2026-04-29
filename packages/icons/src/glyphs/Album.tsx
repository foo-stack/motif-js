import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Album(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polyline, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Polyline points="11 3 11 11 14 8 17 11 17 3" />
        </>
      )}
    />
  );
}

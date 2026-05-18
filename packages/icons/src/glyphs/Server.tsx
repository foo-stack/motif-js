import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Server(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
          <Rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
          <Line x1="6" x2="6.01" y1="6" y2="6" />
          <Line x1="6" x2="6.01" y1="18" y2="18" />
        </>
      )}
    />
  );
}

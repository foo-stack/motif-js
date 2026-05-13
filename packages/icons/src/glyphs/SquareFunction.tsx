import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquareFunction(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" />
          <Path d="M9 11.2h5.7" />
        </>
      )}
    />
  );
}

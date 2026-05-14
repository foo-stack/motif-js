import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquareChevronRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="m10 8 4 4-4 4" />
        </>
      )}
    />
  );
}

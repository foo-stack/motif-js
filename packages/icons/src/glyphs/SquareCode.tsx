import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquareCode(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m10 9-3 3 3 3" />
          <Path d="m14 15 3-3-3-3" />
          <Rect x="3" y="3" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}

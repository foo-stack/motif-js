import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquarePi(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M7 7h10" />
          <Path d="M10 7v10" />
          <Path d="M16 17a2 2 0 0 1-2-2V7" />
        </>
      )}
    />
  );
}

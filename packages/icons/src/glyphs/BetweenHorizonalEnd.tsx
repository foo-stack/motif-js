import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BetweenHorizonalEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="13" height="7" x="3" y="3" rx="1" />
          <Path d="m22 15-3-3 3-3" />
          <Rect width="13" height="7" x="3" y="14" rx="1" />
        </>
      )}
    />
  );
}

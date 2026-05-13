import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BetweenHorizonalStart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="13" height="7" x="8" y="3" rx="1" />
          <Path d="m2 9 3 3-3 3" />
          <Rect width="13" height="7" x="8" y="14" rx="1" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BetweenVerticalStart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="7" height="13" x="3" y="8" rx="1" />
          <Path d="m15 2-3 3-3-3" />
          <Rect width="7" height="13" x="14" y="8" rx="1" />
        </>
      )}
    />
  );
}

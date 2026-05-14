import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function DecimalsArrowRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 18h10" />
          <Path d="m17 21 3-3-3-3" />
          <Path d="M3 11h.01" />
          <Rect x="15" y="3" width="5" height="8" rx="2.5" />
          <Rect x="6" y="3" width="5" height="8" rx="2.5" />
        </>
      )}
    />
  );
}

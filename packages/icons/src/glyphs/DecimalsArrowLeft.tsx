import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function DecimalsArrowLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m13 21-3-3 3-3" />
          <Path d="M20 18H10" />
          <Path d="M3 11h.01" />
          <Rect x="6" y="3" width="5" height="8" rx="2.5" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Vibrate(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m2 8 2 2-2 2 2 2-2 2" />
          <Path d="m22 8-2 2 2 2-2 2 2 2" />
          <Rect width="8" height="14" x="8" y="5" rx="1" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Construction(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="2" y="6" width="20" height="8" rx="1" />
          <Path d="M17 14v7" />
          <Path d="M7 14v7" />
          <Path d="M17 3v3" />
          <Path d="M7 3v3" />
          <Path d="M10 14 2.3 6.3" />
          <Path d="m14 6 7.7 7.7" />
          <Path d="m8 6 8 8" />
        </>
      )}
    />
  );
}

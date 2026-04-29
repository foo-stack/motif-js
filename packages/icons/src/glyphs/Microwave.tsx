import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Microwave(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="20" height="15" x="2" y="4" rx="2" />
          <Rect width="8" height="7" x="6" y="8" rx="1" />
          <Path d="M18 8v7" />
          <Path d="M6 19v2" />
          <Path d="M18 19v2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Calendar1(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M11 14h1v4" />
          <Path d="M16 2v4" />
          <Path d="M3 10h18" />
          <Path d="M8 2v4" />
          <Rect x="3" y="4" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}

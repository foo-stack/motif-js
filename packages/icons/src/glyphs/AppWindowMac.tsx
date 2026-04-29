import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AppWindowMac(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="20" height="16" x="2" y="4" rx="2" />
          <Path d="M6 8h.01" />
          <Path d="M10 8h.01" />
          <Path d="M14 8h.01" />
        </>
      )}
    />
  );
}

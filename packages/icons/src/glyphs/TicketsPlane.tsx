import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TicketsPlane(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12" />
          <Path d="m12 13.5 3.794.506" />
          <Path d="m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8" />
          <Path d="M6 10V8" />
          <Path d="M6 14v1" />
          <Path d="M6 19v2" />
          <Rect x="2" y="8" width="20" height="13" rx="2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CandlestickChart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M9 5v4" />
          <Rect width="4" height="6" x="7" y="9" rx="1" />
          <Path d="M9 15v2" />
          <Path d="M17 3v2" />
          <Rect width="4" height="8" x="15" y="5" rx="1" />
          <Path d="M17 13v3" />
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
        </>
      )}
    />
  );
}

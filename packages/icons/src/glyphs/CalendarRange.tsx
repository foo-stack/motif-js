import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarRange(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="4" rx="2" />
          <Path d="M16 2v4" />
          <Path d="M3 10h18" />
          <Path d="M8 2v4" />
          <Path d="M17 14h-6" />
          <Path d="M13 18H7" />
          <Path d="M7 14h.01" />
          <Path d="M17 18h.01" />
        </>
      )}
    />
  );
}

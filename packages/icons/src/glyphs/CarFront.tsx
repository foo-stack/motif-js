import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CarFront(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
          <Path d="M7 14h.01" />
          <Path d="M17 14h.01" />
          <Rect width="18" height="8" x="3" y="10" rx="2" />
          <Path d="M5 18v2" />
          <Path d="M19 18v2" />
        </>
      )}
    />
  );
}

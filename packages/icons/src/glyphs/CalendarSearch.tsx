import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CalendarSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M16 2v4" />
          <Path d="M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25" />
          <Path d="m22 22-1.875-1.875" />
          <Path d="M3 10h18" />
          <Path d="M8 2v4" />
          <Circle cx="18" cy="18" r="3" />
        </>
      )}
    />
  );
}

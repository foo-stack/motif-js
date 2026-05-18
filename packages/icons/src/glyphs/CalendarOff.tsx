import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CalendarOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18" />
          <Path d="M21 15.5V6a2 2 0 0 0-2-2H9.5" />
          <Path d="M16 2v4" />
          <Path d="M3 10h7" />
          <Path d="M21 10h-5.5" />
          <Path d="m2 2 20 20" />
        </>
      )}
    />
  );
}

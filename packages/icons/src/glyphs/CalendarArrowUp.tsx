import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CalendarArrowUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14 18 4-4 4 4" />
          <Path d="M16 2v4" />
          <Path d="M18 22v-8" />
          <Path d="M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" />
          <Path d="M3 10h18" />
          <Path d="M8 2v4" />
        </>
      )}
    />
  );
}

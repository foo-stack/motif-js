import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CalendarSync(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 10v4h4" />
          <Path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" />
          <Path d="M16 2v4" />
          <Path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" />
          <Path d="M21 22v-4h-4" />
          <Path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" />
          <Path d="M3 10h4" />
          <Path d="M8 2v4" />
        </>
      )}
    />
  );
}

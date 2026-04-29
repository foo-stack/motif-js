import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarCheck2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 2v4" />
          <Path d="M16 2v4" />
          <Path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
          <Path d="M3 10h18" />
          <Path d="m16 20 2 2 4-4" />
        </>
      )}
    />
  );
}

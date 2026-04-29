import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarHeart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125" />
          <Path d="M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
          <Path d="M16 2v4" />
          <Path d="M3 10h18" />
          <Path d="M8 2v4" />
        </>
      )}
    />
  );
}

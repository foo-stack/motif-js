import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Volume2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polygon, Path }) => (
        <>
          <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Users(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle }) => (
        <>
          <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <Circle cx="9" cy="7" r="4" />
          <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )}
    />
  );
}

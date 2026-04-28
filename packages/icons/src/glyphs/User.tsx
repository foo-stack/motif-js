import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function User(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle }) => (
        <>
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <Circle cx="12" cy="7" r="4" />
        </>
      )}
    />
  );
}

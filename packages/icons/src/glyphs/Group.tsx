import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Group(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M3 7V5c0-1.1.9-2 2-2h2" />
          <Path d="M17 3h2c1.1 0 2 .9 2 2v2" />
          <Path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
          <Path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
          <Rect width="7" height="5" x="7" y="7" rx="1" />
          <Rect width="7" height="5" x="10" y="12" rx="1" />
        </>
      )}
    />
  );
}

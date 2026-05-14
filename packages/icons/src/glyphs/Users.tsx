import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Users(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <Path d="M16 3.128a4 4 0 0 1 0 7.744" />
          <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <Circle cx="9" cy="7" r="4" />
        </>
      )}
    />
  );
}

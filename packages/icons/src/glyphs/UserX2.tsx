import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function UserX2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M2 21a8 8 0 0 1 11.873-7" />
          <Circle cx="10" cy="8" r="5" />
          <Path d="m17 17 5 5" />
          <Path d="m22 17-5 5" />
        </>
      )}
    />
  );
}

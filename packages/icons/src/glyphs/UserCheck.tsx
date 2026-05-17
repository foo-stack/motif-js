import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function UserCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m16 11 2 2 4-4" />
          <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <Circle cx="9" cy="7" r="4" />
        </>
      )}
    />
  );
}

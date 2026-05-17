import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function UserX(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line, Path }) => (
        <>
          <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <Circle cx="9" cy="7" r="4" />
          <Line x1="17" x2="22" y1="8" y2="13" />
          <Line x1="22" x2="17" y1="8" y2="13" />
        </>
      )}
    />
  );
}

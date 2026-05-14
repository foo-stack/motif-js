import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function UserMinus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line, Path }) => (
        <>
          <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <Circle cx="9" cy="7" r="4" />
          <Line x1="22" x2="16" y1="11" y2="11" />
        </>
      )}
    />
  );
}

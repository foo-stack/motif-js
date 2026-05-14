import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function UserLock(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M19 16v-2a2 2 0 0 0-4 0v2" />
          <Path d="M9.5 15H7a4 4 0 0 0-4 4v2" />
          <Circle cx="10" cy="7" r="4" />
          <Rect x="13" y="16" width="8" height="5" rx=".899" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserSquare2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M18 21a6 6 0 0 0-12 0" />
          <Circle cx="12" cy="11" r="4" />
          <Rect width="18" height="18" x="3" y="3" rx="2" />
        </>
      )}
    />
  );
}

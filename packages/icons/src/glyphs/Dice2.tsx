import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Dice2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Path d="M15 9h.01" />
          <Path d="M9 15h.01" />
        </>
      )}
    />
  );
}

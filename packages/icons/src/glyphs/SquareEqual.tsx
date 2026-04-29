import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareEqual(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M7 10h10" />
          <Path d="M7 14h10" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareArrowRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M8 12h8" />
          <Path d="m12 16 4-4-4-4" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquareArrowUpRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M8 8h8v8" />
          <Path d="m8 16 8-8" />
        </>
      )}
    />
  );
}

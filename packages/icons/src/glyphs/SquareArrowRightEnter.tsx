import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquareArrowRightEnter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m10 16 4-4-4-4" />
          <Path d="M3 12h11" />
          <Path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
        </>
      )}
    />
  );
}

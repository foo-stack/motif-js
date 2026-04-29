import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RotateCcwSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M20 9V7a2 2 0 0 0-2-2h-6" />
          <Path d="m15 2-3 3 3 3" />
          <Path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
        </>
      )}
    />
  );
}

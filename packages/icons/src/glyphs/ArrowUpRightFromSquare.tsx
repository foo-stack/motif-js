import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUpRightFromSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <Path d="m21 3-9 9" />
          <Path d="M15 3h6v6" />
        </>
      )}
    />
  );
}

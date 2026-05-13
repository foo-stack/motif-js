import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SplitSquareHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3" />
          <Path d="M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3" />
          <Line x1="12" x2="12" y1="4" y2="20" />
        </>
      )}
    />
  );
}

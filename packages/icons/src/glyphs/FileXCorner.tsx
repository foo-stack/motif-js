import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FileXCorner(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5" />
          <Path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <Path d="m15 17 5 5" />
          <Path d="m20 17-5 5" />
        </>
      )}
    />
  );
}

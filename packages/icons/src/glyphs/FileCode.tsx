import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileCode(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
          <Path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <Path d="M10 12.5 8 15l2 2.5" />
          <Path d="m14 12.5 2 2.5-2 2.5" />
        </>
      )}
    />
  );
}

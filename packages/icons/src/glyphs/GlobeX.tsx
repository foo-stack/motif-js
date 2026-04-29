import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GlobeX(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m16 3 5 5" />
          <Path d="M2 12h20A10 10 0 1 1 12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 4-10" />
          <Path d="m21 3-5 5" />
        </>
      )}
    />
  );
}

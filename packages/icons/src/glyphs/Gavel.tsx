import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Gavel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
          <Path d="m16 16 6-6" />
          <Path d="m21.5 10.5-8-8" />
          <Path d="m8 8 6-6" />
          <Path d="m8.5 7.5 8 8" />
        </>
      )}
    />
  );
}

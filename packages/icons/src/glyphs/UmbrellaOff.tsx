import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UmbrellaOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 13v7a2 2 0 0 0 4 0" />
          <Path d="M12 2v2" />
          <Path d="M18.656 13h2.336a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-12.07-7.51" />
          <Path d="m2 2 20 20" />
          <Path d="M5.961 5.957a10.28 10.28 0 0 0-3.922 5.769A1 1 0 0 0 3 13h10" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Gem(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10.5 3 8 9l4 13 4-13-2.5-6" />
          <Path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z" />
          <Path d="M2 9h20" />
        </>
      )}
    />
  );
}

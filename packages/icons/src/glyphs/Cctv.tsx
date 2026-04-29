import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cctv(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97" />
          <Path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z" />
          <Path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" />
          <Path d="M2 21v-4" />
          <Path d="M7 9h.01" />
        </>
      )}
    />
  );
}

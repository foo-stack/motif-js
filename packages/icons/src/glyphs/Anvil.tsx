import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Anvil(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4" />
          <Path d="M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z" />
          <Path d="M9 12v5" />
          <Path d="M15 12v5" />
          <Path d="M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1" />
        </>
      )}
    />
  );
}

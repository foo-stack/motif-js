import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListChevronsDownUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5h8" />
          <Path d="M3 12h8" />
          <Path d="M3 19h8" />
          <Path d="m15 5 3 3 3-3" />
          <Path d="m15 19 3-3 3 3" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListChevronsUpDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5h8" />
          <Path d="M3 12h8" />
          <Path d="M3 19h8" />
          <Path d="m15 8 3-3 3 3" />
          <Path d="m15 16 3 3 3-3" />
        </>
      )}
    />
  );
}

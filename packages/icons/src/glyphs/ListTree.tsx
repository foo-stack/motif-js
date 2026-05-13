import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListTree(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 5h13" />
          <Path d="M13 12h8" />
          <Path d="M13 19h8" />
          <Path d="M3 10a2 2 0 0 0 2 2h3" />
          <Path d="M3 5v12a2 2 0 0 0 2 2h3" />
        </>
      )}
    />
  );
}

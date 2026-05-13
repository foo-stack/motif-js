import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function List(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5h.01" />
          <Path d="M3 12h.01" />
          <Path d="M3 19h.01" />
          <Path d="M8 5h13" />
          <Path d="M8 12h13" />
          <Path d="M8 19h13" />
        </>
      )}
    />
  );
}

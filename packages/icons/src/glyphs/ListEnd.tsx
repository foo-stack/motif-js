import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 5H3" />
          <Path d="M16 12H3" />
          <Path d="M9 19H3" />
          <Path d="m16 16-3 3 3 3" />
          <Path d="M21 5v12a2 2 0 0 1-2 2h-6" />
        </>
      )}
    />
  );
}

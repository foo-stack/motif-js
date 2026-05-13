import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListCollapse(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 5h11" />
          <Path d="M10 12h11" />
          <Path d="M10 19h11" />
          <Path d="m3 10 3-3-3-3" />
          <Path d="m3 20 3-3-3-3" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Minimize2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14 10 7-7" />
          <Path d="M20 10h-6V4" />
          <Path d="m3 21 7-7" />
          <Path d="M4 14h6v6" />
        </>
      )}
    />
  );
}

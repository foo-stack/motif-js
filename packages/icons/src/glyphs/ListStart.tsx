import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListStart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5h6" />
          <Path d="M3 12h13" />
          <Path d="M3 19h13" />
          <Path d="m16 8-3-3 3-3" />
          <Path d="M21 19V7a2 2 0 0 0-2-2h-6" />
        </>
      )}
    />
  );
}

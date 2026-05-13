import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ScanText(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <Path d="M7 8h8" />
          <Path d="M7 12h10" />
          <Path d="M7 16h6" />
        </>
      )}
    />
  );
}

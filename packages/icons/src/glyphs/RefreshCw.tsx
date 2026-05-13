import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RefreshCw(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <Path d="M21 3v5h-5" />
          <Path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <Path d="M8 16H3v5" />
        </>
      )}
    />
  );
}

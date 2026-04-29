import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ScanSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <Circle cx="12" cy="12" r="3" />
          <Path d="m16 16-1.9-1.9" />
        </>
      )}
    />
  );
}

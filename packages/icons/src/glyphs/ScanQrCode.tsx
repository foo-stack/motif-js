import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ScanQrCode(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M17 12v4a1 1 0 0 1-1 1h-4" />
          <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <Path d="M17 8V7" />
          <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <Path d="M7 17h.01" />
          <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <Rect x="7" y="7" width="5" height="5" rx="1" />
        </>
      )}
    />
  );
}

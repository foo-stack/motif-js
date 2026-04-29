import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorSmartphone(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
          <Path d="M10 19v-3.96 3.15" />
          <Path d="M7 19h5" />
          <Rect width="6" height="10" x="16" y="12" rx="2" />
        </>
      )}
    />
  );
}

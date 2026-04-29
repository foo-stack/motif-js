import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TabletSmartphone(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="10" height="14" x="3" y="8" rx="2" />
          <Path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />
          <Path d="M8 18h.01" />
        </>
      )}
    />
  );
}

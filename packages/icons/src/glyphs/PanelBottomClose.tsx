import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PanelBottomClose(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M3 15h18" />
          <Path d="m15 8-3 3-3-3" />
        </>
      )}
    />
  );
}

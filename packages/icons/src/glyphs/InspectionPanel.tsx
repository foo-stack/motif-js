import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function InspectionPanel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M7 7h.01" />
          <Path d="M17 7h.01" />
          <Path d="M7 17h.01" />
          <Path d="M17 17h.01" />
        </>
      )}
    />
  );
}

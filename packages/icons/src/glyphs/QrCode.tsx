import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function QrCode(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="5" height="5" x="3" y="3" rx="1" />
          <Rect width="5" height="5" x="16" y="3" rx="1" />
          <Rect width="5" height="5" x="3" y="16" rx="1" />
          <Path d="M21 16h-3a2 2 0 0 0-2 2v3" />
          <Path d="M21 21v.01" />
          <Path d="M12 7v3a2 2 0 0 1-2 2H7" />
          <Path d="M3 12h.01" />
          <Path d="M12 3h.01" />
          <Path d="M12 16v.01" />
          <Path d="M16 12h1" />
          <Path d="M21 12v.01" />
          <Path d="M12 21v-1" />
        </>
      )}
    />
  );
}

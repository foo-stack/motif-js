import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Grid2X2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 3v18" />
          <Path d="M3 12h18" />
          <Rect x="3" y="3" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}

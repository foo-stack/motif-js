import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CableCar(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 3h.01" />
          <Path d="M14 2h.01" />
          <Path d="m2 9 20-5" />
          <Path d="M12 12V6.5" />
          <Rect width="16" height="10" x="4" y="12" rx="3" />
          <Path d="M9 12v5" />
          <Path d="M15 12v5" />
          <Path d="M4 17h16" />
        </>
      )}
    />
  );
}

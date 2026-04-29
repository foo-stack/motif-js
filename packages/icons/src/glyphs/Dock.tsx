import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Dock(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M2 8h20" />
          <Rect width="20" height="16" x="2" y="4" rx="2" />
          <Path d="M6 16h12" />
        </>
      )}
    />
  );
}

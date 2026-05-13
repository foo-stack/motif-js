import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Sidebar(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M9 3v18" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PanelRightClose(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M15 3v18" />
          <Path d="m8 9 3 3-3 3" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function PanelBottomOpen(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M3 15h18" />
          <Path d="m9 10 3-3 3 3" />
        </>
      )}
    />
  );
}

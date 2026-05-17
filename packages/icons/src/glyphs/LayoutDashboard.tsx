import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function LayoutDashboard(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect width="7" height="9" x="3" y="3" rx="1" />
          <Rect width="7" height="5" x="14" y="3" rx="1" />
          <Rect width="7" height="9" x="14" y="12" rx="1" />
          <Rect width="7" height="5" x="3" y="16" rx="1" />
        </>
      )}
    />
  );
}

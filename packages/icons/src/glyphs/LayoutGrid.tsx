import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LayoutGrid(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect width="7" height="7" x="3" y="3" rx="1" />
          <Rect width="7" height="7" x="14" y="3" rx="1" />
          <Rect width="7" height="7" x="14" y="14" rx="1" />
          <Rect width="7" height="7" x="3" y="14" rx="1" />
        </>
      )}
    />
  );
}

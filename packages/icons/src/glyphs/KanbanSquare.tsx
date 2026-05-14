import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function KanbanSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M8 7v7" />
          <Path d="M12 7v4" />
          <Path d="M16 7v9" />
        </>
      )}
    />
  );
}

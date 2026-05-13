import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArchiveRestore(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="20" height="5" x="2" y="3" rx="1" />
          <Path d="M4 8v11a2 2 0 0 0 2 2h2" />
          <Path d="M20 8v11a2 2 0 0 1-2 2h-2" />
          <Path d="m9 15 3-3 3 3" />
          <Path d="M12 12v9" />
        </>
      )}
    />
  );
}

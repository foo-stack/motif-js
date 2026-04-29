import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderLock(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="8" height="5" x="14" y="17" rx="1" />
          <Path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5" />
          <Path d="M20 17v-2a2 2 0 1 0-4 0v2" />
        </>
      )}
    />
  );
}

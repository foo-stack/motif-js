import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function FolderKanban(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          <Path d="M8 10v4" />
          <Path d="M12 10v2" />
          <Path d="M16 10v6" />
        </>
      )}
    />
  );
}

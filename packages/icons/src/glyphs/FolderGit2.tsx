import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderGit2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M18 19a5 5 0 0 1-5-5v8" />
          <Path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5" />
          <Circle cx="13" cy="12" r="2" />
          <Circle cx="20" cy="19" r="2" />
        </>
      )}
    />
  );
}

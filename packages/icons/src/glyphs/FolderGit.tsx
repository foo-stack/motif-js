import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderGit(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="13" r="2" />
          <Path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          <Path d="M14 13h3" />
          <Path d="M7 13h3" />
        </>
      )}
    />
  );
}

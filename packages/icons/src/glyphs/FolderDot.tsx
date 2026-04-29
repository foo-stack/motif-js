import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          <Circle cx="12" cy="13" r="1" />
        </>
      )}
    />
  );
}

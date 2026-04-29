import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1" />
          <Path d="m21 21-1.9-1.9" />
          <Circle cx="17" cy="17" r="3" />
        </>
      )}
    />
  );
}

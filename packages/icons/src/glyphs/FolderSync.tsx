import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderSync(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5" />
          <Path d="M12 10v4h4" />
          <Path d="m12 14 1.535-1.605a5 5 0 0 1 8 1.5" />
          <Path d="M22 22v-4h-4" />
          <Path d="m22 18-1.535 1.605a5 5 0 0 1-8-1.5" />
        </>
      )}
    />
  );
}

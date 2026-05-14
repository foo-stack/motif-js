import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlignCenterVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v20" />
          <Path d="M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4" />
          <Path d="M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" />
          <Path d="M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1" />
          <Path d="M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
        </>
      )}
    />
  );
}

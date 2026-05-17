import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function TestTube2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3" />
          <Path d="m16 2 6 6" />
          <Path d="M12 16H4" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ConciergeBell(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z" />
          <Path d="M20 16a8 8 0 1 0-16 0" />
          <Path d="M12 4v4" />
          <Path d="M10 4h4" />
        </>
      )}
    />
  );
}

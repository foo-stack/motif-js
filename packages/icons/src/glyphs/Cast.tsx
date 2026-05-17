import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Cast(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
          <Path d="M2 12a9 9 0 0 1 8 8" />
          <Path d="M2 16a5 5 0 0 1 4 4" />
          <Line x1="2" x2="2.01" y1="20" y2="20" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleDotDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
          <Path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
          <Path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
          <Path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
          <Path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
          <Path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
          <Path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
          <Path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
          <Circle cx="12" cy="12" r="1" />
        </>
      )}
    />
  );
}

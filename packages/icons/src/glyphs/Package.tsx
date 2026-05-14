import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Package(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline }) => (
        <>
          <Path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
          <Path d="M12 22V12" />
          <Polyline points="3.29 7 12 12 20.71 7" />
          <Path d="m7.5 4.27 9 5.15" />
        </>
      )}
    />
  );
}

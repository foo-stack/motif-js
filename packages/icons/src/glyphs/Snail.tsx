import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Snail(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0" />
          <Circle cx="10" cy="13" r="8" />
          <Path d="M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6" />
          <Path d="M18 3 19.1 5.2" />
          <Path d="M22 3 20.9 5.2" />
        </>
      )}
    />
  );
}

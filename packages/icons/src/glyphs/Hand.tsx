import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Hand(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
          <Path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
          <Path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
          <Path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </>
      )}
    />
  );
}

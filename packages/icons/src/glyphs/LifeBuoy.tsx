import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LifeBuoy(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="m4.93 4.93 4.24 4.24" />
          <Path d="m14.83 9.17 4.24-4.24" />
          <Path d="m14.83 14.83 4.24 4.24" />
          <Path d="m9.17 14.83-4.24 4.24" />
          <Circle cx="12" cy="12" r="4" />
        </>
      )}
    />
  );
}

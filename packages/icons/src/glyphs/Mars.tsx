import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Mars(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M16 3h5v5" />
          <Path d="m21 3-6.75 6.75" />
          <Circle cx="10" cy="14" r="6" />
        </>
      )}
    />
  );
}

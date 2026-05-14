import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function UserRoundSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="10" cy="8" r="5" />
          <Path d="M2 21a8 8 0 0 1 10.434-7.62" />
          <Circle cx="18" cy="18" r="3" />
          <Path d="m22 22-1.9-1.9" />
        </>
      )}
    />
  );
}

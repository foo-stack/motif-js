import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MoveRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 8L22 12L18 16" />
          <Path d="M2 12H22" />
        </>
      )}
    />
  );
}

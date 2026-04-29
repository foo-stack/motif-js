import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MoveLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 8L2 12L6 16" />
          <Path d="M2 12H22" />
        </>
      )}
    />
  );
}

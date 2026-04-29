import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleCheckBig(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21.801 10A10 10 0 1 1 17 3.335" />
          <Path d="m9 11 3 3L22 4" />
        </>
      )}
    />
  );
}

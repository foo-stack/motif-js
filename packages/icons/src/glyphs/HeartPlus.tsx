import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HeartPlus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49" />
          <Path d="M15 15h6" />
          <Path d="M18 12v6" />
        </>
      )}
    />
  );
}

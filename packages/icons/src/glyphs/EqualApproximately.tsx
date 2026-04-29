import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function EqualApproximately(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" />
          <Path d="M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" />
        </>
      )}
    />
  );
}

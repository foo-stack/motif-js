import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Dam(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 11.31c1.17.56 1.54 1.69 3.5 1.69 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <Path d="M11.75 18c.35.5 1.45 1 2.75 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <Path d="M2 10h4" />
          <Path d="M2 14h4" />
          <Path d="M2 18h4" />
          <Path d="M2 6h4" />
          <Path d="M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L10 4a1 1 0 0 0-1-1z" />
        </>
      )}
    />
  );
}

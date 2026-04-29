import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function DiamondMinus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z" />
          <Path d="M8 12h8" />
        </>
      )}
    />
  );
}

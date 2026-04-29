import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowLeftRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 3 4 7l4 4" />
          <Path d="M4 7h16" />
          <Path d="m16 21 4-4-4-4" />
          <Path d="M20 17H4" />
        </>
      )}
    />
  );
}

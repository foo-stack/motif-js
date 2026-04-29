import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUpRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M7 7h10v10" />
          <Path d="M7 17 17 7" />
        </>
      )}
    />
  );
}

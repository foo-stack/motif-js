import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MoveUpRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13 5H19V11" />
          <Path d="M19 5L5 19" />
        </>
      )}
    />
  );
}

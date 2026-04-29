import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MessageSquareOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 19H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 1.184-1.826" />
          <Path d="m2 2 20 20" />
          <Path d="M8.656 3H20a2 2 0 0 1 2 2v11.344" />
        </>
      )}
    />
  );
}

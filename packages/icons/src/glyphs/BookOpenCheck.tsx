import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BookOpenCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 21V7" />
          <Path d="m16 12 2 2 4-4" />
          <Path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" />
        </>
      )}
    />
  );
}

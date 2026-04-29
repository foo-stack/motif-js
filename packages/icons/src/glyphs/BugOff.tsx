import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BugOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 20v-8" />
          <Path d="M12.656 7H14a4 4 0 0 1 4 4v1.344" />
          <Path d="M14.12 3.88 16 2" />
          <Path d="M17.123 17.123A6 6 0 0 1 6 14v-3a4 4 0 0 1 1.72-3.287" />
          <Path d="m2 2 20 20" />
          <Path d="M21 5a4 4 0 0 1-3.55 3.97" />
          <Path d="M22 13h-3.344" />
          <Path d="M3 21a4 4 0 0 1 3.81-4" />
          <Path d="M3 5a4 4 0 0 0 3.55 3.97" />
          <Path d="M6 13H2" />
          <Path d="m8 2 1.88 1.88" />
          <Path d="M9.712 4.06A3 3 0 0 1 15 6v1.13" />
        </>
      )}
    />
  );
}

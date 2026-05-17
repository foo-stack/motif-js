import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Split(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 3h5v5" />
          <Path d="M8 3H3v5" />
          <Path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
          <Path d="m15 9 6-6" />
        </>
      )}
    />
  );
}

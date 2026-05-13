import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Command(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
      )}
    />
  );
}

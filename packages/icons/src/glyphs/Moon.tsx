import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Moon(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cloud(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />}
    />
  );
}

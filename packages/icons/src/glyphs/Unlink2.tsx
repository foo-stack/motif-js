import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Unlink2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" />}
    />
  );
}

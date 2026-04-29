import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LensConcave(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M7 2a1 1 0 0 0-.8 1.6 14 14 0 0 1 0 16.8A1 1 0 0 0 7 22h10a1 1 0 0 0 .8-1.6 14 14 0 0 1 0-16.8A1 1 0 0 0 17 2z" />
      )}
    />
  );
}

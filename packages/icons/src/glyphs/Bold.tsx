import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Bold(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
      )}
    />
  );
}

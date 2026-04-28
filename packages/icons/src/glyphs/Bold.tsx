import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Bold(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      )}
    />
  );
}

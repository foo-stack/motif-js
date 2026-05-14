import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Slice(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14" />
      )}
    />
  );
}

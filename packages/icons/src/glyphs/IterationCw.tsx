import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function IterationCw(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 10a8 8 0 1 1 8 8H4" />
          <Path d="m8 22-4-4 4-4" />
        </>
      )}
    />
  );
}

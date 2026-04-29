import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m6 17 5-5-5-5" />
          <Path d="m13 17 5-5-5-5" />
        </>
      )}
    />
  );
}

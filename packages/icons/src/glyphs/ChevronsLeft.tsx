import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m11 17-5-5 5-5" />
          <Path d="m18 17-5-5 5-5" />
        </>
      )}
    />
  );
}

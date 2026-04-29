import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 5H3" />
          <Path d="M16 12H3" />
          <Path d="M11 19H3" />
          <Path d="m15 18 2 2 4-4" />
        </>
      )}
    />
  );
}

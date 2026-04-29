import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListMinus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 5H3" />
          <Path d="M11 12H3" />
          <Path d="M16 19H3" />
          <Path d="M21 12h-6" />
        </>
      )}
    />
  );
}

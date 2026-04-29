import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListFilter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 5h20" />
          <Path d="M6 12h12" />
          <Path d="M9 19h6" />
        </>
      )}
    />
  );
}

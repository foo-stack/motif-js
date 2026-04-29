import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudBackup(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 15.251A4.5 4.5 0 0 0 17.5 8h-1.79A7 7 0 1 0 3 13.607" />
          <Path d="M7 11v4h4" />
          <Path d="M8 19a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5 4.82 4.82 0 0 0-3.41 1.41L7 15" />
        </>
      )}
    />
  );
}

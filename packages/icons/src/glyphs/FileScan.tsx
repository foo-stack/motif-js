import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileScan(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M20 10V8a2.4 2.4 0 0 0-.706-1.704l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4.35" />
          <Path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <Path d="M16 14a2 2 0 0 0-2 2" />
          <Path d="M16 22a2 2 0 0 1-2-2" />
          <Path d="M20 14a2 2 0 0 1 2 2" />
          <Path d="M20 22a2 2 0 0 0 2-2" />
        </>
      )}
    />
  );
}

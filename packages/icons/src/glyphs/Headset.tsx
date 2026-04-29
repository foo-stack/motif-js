import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Headset(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
          <Path d="M21 16v2a4 4 0 0 1-4 4h-5" />
        </>
      )}
    />
  );
}

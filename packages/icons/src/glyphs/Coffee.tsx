import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Coffee(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 2v2" />
          <Path d="M14 2v2" />
          <Path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
          <Path d="M6 2v2" />
        </>
      )}
    />
  );
}

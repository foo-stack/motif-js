import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function VenetianMask(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 11c-1.5 0-2.5.5-3 2" />
          <Path d="M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z" />
          <Path d="M6 11c1.5 0 2.5.5 3 2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CornerDownLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M20 4v7a4 4 0 0 1-4 4H4" />
          <Path d="m9 10-5 5 5 5" />
        </>
      )}
    />
  );
}

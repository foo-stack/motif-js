import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CornerLeftUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14 9 9 4 4 9" />
          <Path d="M20 20h-7a4 4 0 0 1-4-4V4" />
        </>
      )}
    />
  );
}

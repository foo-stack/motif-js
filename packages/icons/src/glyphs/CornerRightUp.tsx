import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CornerRightUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m10 9 5-5 5 5" />
          <Path d="M4 20h7a4 4 0 0 0 4-4V4" />
        </>
      )}
    />
  );
}

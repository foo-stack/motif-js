import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ScreenShareOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
          <Path d="M8 21h8" />
          <Path d="M12 17v4" />
          <Path d="m22 3-5 5" />
          <Path d="m17 3 5 5" />
        </>
      )}
    />
  );
}

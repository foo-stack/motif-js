import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Bath(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 4 8 6" />
          <Path d="M17 19v2" />
          <Path d="M2 12h20" />
          <Path d="M7 19v2" />
          <Path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
        </>
      )}
    />
  );
}

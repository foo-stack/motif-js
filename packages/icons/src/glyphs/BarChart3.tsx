import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BarChart3(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="M18 17V9" />
          <Path d="M13 17V5" />
          <Path d="M8 17v-3" />
        </>
      )}
    />
  );
}

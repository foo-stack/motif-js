import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TrendingDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 17h6v-6" />
          <Path d="m22 17-8.5-8.5-5 5L2 7" />
        </>
      )}
    />
  );
}

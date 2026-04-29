import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Brain(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 18V5" />
          <Path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
          <Path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
          <Path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
          <Path d="M18 18a4 4 0 0 0 2-7.464" />
          <Path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
          <Path d="M6 18a4 4 0 0 1-2-7.464" />
          <Path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
        </>
      )}
    />
  );
}

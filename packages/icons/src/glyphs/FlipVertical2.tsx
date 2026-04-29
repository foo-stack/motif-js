import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FlipVertical2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m17 3-5 5-5-5h10" />
          <Path d="m17 21-5-5-5 5h10" />
          <Path d="M4 12H2" />
          <Path d="M10 12H8" />
          <Path d="M16 12h-2" />
          <Path d="M22 12h-2" />
        </>
      )}
    />
  );
}

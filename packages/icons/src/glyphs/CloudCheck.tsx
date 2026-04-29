import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m17 15-5.5 5.5L9 18" />
          <Path d="M5.516 16.07A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 3.501 7.327" />
        </>
      )}
    />
  );
}

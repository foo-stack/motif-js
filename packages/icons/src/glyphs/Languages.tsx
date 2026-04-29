import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Languages(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m5 8 6 6" />
          <Path d="m4 14 6-6 2-3" />
          <Path d="M2 5h12" />
          <Path d="M7 2h1" />
          <Path d="m22 22-5-10-5 10" />
          <Path d="M14 18h6" />
        </>
      )}
    />
  );
}

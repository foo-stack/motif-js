import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CheckCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 6 7 17l-5-5" />
          <Path d="m22 10-7.5 7.5L13 16" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function X(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 6 6 18" />
          <Path d="m6 6 12 12" />
        </>
      )}
    />
  );
}

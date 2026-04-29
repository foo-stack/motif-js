import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Code(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m16 18 6-6-6-6" />
          <Path d="m8 6-6 6 6 6" />
        </>
      )}
    />
  );
}

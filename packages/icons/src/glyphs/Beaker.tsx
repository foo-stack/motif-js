import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Beaker(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4.5 3h15" />
          <Path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
          <Path d="M6 14h12" />
        </>
      )}
    />
  );
}

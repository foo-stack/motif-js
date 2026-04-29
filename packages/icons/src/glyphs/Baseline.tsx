import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Baseline(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 20h16" />
          <Path d="m6 16 6-12 6 12" />
          <Path d="M8 12h8" />
        </>
      )}
    />
  );
}

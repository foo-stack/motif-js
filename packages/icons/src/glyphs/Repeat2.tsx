import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Repeat2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m2 9 3-3 3 3" />
          <Path d="M13 18H7a2 2 0 0 1-2-2V6" />
          <Path d="m22 15-3 3-3-3" />
          <Path d="M11 6h6a2 2 0 0 1 2 2v10" />
        </>
      )}
    />
  );
}

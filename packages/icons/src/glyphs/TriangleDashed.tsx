import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function TriangleDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10.17 4.193a2 2 0 0 1 3.666.013" />
          <Path d="M14 21h2" />
          <Path d="m15.874 7.743 1 1.732" />
          <Path d="m18.849 12.952 1 1.732" />
          <Path d="M21.824 18.18a2 2 0 0 1-1.835 2.824" />
          <Path d="M4.024 21a2 2 0 0 1-1.839-2.839" />
          <Path d="m5.136 12.952-1 1.732" />
          <Path d="M8 21h2" />
          <Path d="m8.102 7.743-1 1.732" />
        </>
      )}
    />
  );
}

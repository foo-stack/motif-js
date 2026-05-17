import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Theater(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 10s3-3 3-8" />
          <Path d="M22 10s-3-3-3-8" />
          <Path d="M10 2c0 4.4-3.6 8-8 8" />
          <Path d="M14 2c0 4.4 3.6 8 8 8" />
          <Path d="M2 10s2 2 2 5" />
          <Path d="M22 10s-2 2-2 5" />
          <Path d="M8 15h8" />
          <Path d="M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
          <Path d="M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
        </>
      )}
    />
  );
}

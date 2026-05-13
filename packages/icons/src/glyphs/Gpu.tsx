import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Gpu(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M2 17h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H2" />
          <Path d="M2 21V3" />
          <Path d="M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3" />
          <Circle cx="16" cy="11" r="2" />
          <Circle cx="8" cy="11" r="2" />
        </>
      )}
    />
  );
}

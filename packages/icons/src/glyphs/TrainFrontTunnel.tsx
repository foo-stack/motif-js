import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TrainFrontTunnel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 22V12a10 10 0 1 1 20 0v10" />
          <Path d="M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8" />
          <Path d="M10 15h.01" />
          <Path d="M14 15h.01" />
          <Path d="M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z" />
          <Path d="m9 19-2 3" />
          <Path d="m15 19 2 3" />
        </>
      )}
    />
  );
}

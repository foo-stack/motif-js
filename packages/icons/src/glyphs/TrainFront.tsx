import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function TrainFront(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" />
          <Path d="m9 15-1-1" />
          <Path d="m15 15 1-1" />
          <Path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" />
          <Path d="m8 19-2 3" />
          <Path d="m16 19 2 3" />
        </>
      )}
    />
  );
}

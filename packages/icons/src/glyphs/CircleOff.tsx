import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CircleOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m2 2 20 20" />
          <Path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" />
          <Path d="M19.08 19.08A10 10 0 1 1 4.92 4.92" />
        </>
      )}
    />
  );
}

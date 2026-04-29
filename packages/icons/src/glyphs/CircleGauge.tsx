import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleGauge(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
          <Circle cx="12" cy="12" r="2" />
          <Path d="M13.4 10.6 19 5" />
        </>
      )}
    />
  );
}

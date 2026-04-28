import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Clock(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Polyline }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CheckCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline }) => (
        <>
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <Polyline points="22 4 12 14.01 9 11.01" />
        </>
      )}
    />
  );
}

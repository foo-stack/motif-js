import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function DollarSign(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Line x1="12" x2="12" y1="2" y2="22" />
          <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>
      )}
    />
  );
}

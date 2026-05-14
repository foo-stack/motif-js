import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Variable(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M8 21s-4-3-4-9 4-9 4-9" />
          <Path d="M16 3s4 3 4 9-4 9-4 9" />
          <Line x1="15" x2="9" y1="9" y2="15" />
          <Line x1="9" x2="15" y1="9" y2="15" />
        </>
      )}
    />
  );
}

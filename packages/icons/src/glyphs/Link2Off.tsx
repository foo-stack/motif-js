import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Link2Off(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M9 17H7A5 5 0 0 1 7 7" />
          <Path d="M15 7h2a5 5 0 0 1 4 8" />
          <Line x1="8" x2="12" y1="12" y2="12" />
          <Line x1="2" x2="22" y1="2" y2="22" />
        </>
      )}
    />
  );
}

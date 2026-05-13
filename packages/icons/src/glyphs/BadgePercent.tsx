import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BadgePercent(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <Path d="m15 9-6 6" />
          <Path d="M9 9h.01" />
          <Path d="M15 15h.01" />
        </>
      )}
    />
  );
}

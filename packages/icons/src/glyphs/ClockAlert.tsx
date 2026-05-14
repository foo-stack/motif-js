import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ClockAlert(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 6v6l4 2" />
          <Path d="M20 12v5" />
          <Path d="M20 21h.01" />
          <Path d="M21.25 8.2A10 10 0 1 0 16 21.16" />
        </>
      )}
    />
  );
}

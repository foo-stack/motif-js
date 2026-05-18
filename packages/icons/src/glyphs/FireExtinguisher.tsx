import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FireExtinguisher(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5" />
          <Path d="M9 18h8" />
          <Path d="M18 3h-3" />
          <Path d="M11 3a6 6 0 0 0-6 6v11" />
          <Path d="M5 13h4" />
          <Path d="M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" />
        </>
      )}
    />
  );
}

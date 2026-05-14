import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlertTriangle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <Path d="M12 9v4" />
          <Path d="M12 17h.01" />
        </>
      )}
    />
  );
}

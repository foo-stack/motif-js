import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BookOpenText(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 7v14" />
          <Path d="M16 12h2" />
          <Path d="M16 8h2" />
          <Path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          <Path d="M6 12h2" />
          <Path d="M6 8h2" />
        </>
      )}
    />
  );
}

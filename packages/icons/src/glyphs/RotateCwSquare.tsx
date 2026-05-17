import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function RotateCwSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 5H6a2 2 0 0 0-2 2v3" />
          <Path d="m9 8 3-3-3-3" />
          <Path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        </>
      )}
    />
  );
}

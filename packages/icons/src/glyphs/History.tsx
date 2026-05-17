import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function History(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <Path d="M3 3v5h5" />
          <Path d="M12 7v5l4 2" />
        </>
      )}
    />
  );
}

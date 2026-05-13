import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Brackets(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3" />
          <Path d="M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MoveDownLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 19H5V13" />
          <Path d="M19 5L5 19" />
        </>
      )}
    />
  );
}

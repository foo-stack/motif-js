import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MoveDownRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 13V19H13" />
          <Path d="M5 5L19 19" />
        </>
      )}
    />
  );
}

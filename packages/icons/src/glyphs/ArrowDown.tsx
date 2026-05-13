import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 5v14" />
          <Path d="m19 12-7 7-7-7" />
        </>
      )}
    />
  );
}

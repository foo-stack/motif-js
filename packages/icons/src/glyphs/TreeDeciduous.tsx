import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TreeDeciduous(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z" />
          <Path d="M12 19v3" />
        </>
      )}
    />
  );
}

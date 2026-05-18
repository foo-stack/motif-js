import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowUpLeftFromSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" />
          <Path d="m3 3 9 9" />
          <Path d="M3 9V3h6" />
        </>
      )}
    />
  );
}

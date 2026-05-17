import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowUpDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m21 16-4 4-4-4" />
          <Path d="M17 20V4" />
          <Path d="m3 8 4-4 4 4" />
          <Path d="M7 4v16" />
        </>
      )}
    />
  );
}

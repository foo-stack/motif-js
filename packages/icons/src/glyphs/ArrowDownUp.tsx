import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowDownUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m3 16 4 4 4-4" />
          <Path d="M7 20V4" />
          <Path d="m21 8-4-4-4 4" />
          <Path d="M17 4v16" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Expand(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 15 6 6" />
          <Path d="m15 9 6-6" />
          <Path d="M21 16v5h-5" />
          <Path d="M21 8V3h-5" />
          <Path d="M3 16v5h5" />
          <Path d="m3 21 6-6" />
          <Path d="M3 8V3h5" />
          <Path d="M9 9 3 3" />
        </>
      )}
    />
  );
}

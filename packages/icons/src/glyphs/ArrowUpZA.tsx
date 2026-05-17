import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowUpZA(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m3 8 4-4 4 4" />
          <Path d="M7 4v16" />
          <Path d="M15 4h5l-5 6h5" />
          <Path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" />
          <Path d="M20 18h-5" />
        </>
      )}
    />
  );
}

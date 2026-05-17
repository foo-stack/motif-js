import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function PhilippinePeso(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M20 11H4" />
          <Path d="M20 7H4" />
          <Path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" />
        </>
      )}
    />
  );
}

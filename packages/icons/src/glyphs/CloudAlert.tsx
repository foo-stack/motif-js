import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CloudAlert(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 12v4" />
          <Path d="M12 20h.01" />
          <Path d="M8.128 16.949A7 7 0 1 1 15.71 8h1.79a1 1 0 0 1 0 9h-1.642" />
        </>
      )}
    />
  );
}

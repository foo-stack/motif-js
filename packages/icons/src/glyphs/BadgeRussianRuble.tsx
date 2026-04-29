import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BadgeRussianRuble(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <Path d="M9 16h5" />
          <Path d="M9 12h5a2 2 0 1 0 0-4h-3v9" />
        </>
      )}
    />
  );
}

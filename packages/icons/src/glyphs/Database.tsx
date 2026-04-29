import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Database(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Ellipse, Path }) => (
        <>
          <Ellipse cx="12" cy="5" rx="9" ry="3" />
          <Path d="M3 5V19A9 3 0 0 0 21 19V5" />
          <Path d="M3 12A9 3 0 0 0 21 12" />
        </>
      )}
    />
  );
}

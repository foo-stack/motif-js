import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PersonStanding(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="5" r="1" />
          <Path d="m9 20 3-6 3 6" />
          <Path d="m6 8 6 2 6-2" />
          <Path d="M12 10v4" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Bike(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="18.5" cy="17.5" r="3.5" />
          <Circle cx="5.5" cy="17.5" r="3.5" />
          <Circle cx="15" cy="5" r="1" />
          <Path d="M12 17.5V14l-3-3 4-3 2 3h2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MapPin(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle }) => (
        <>
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <Circle cx="12" cy="10" r="3" />
        </>
      )}
    />
  );
}

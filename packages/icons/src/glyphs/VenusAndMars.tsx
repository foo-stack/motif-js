import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function VenusAndMars(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10 20h4" />
          <Path d="M12 16v6" />
          <Path d="M17 2h4v4" />
          <Path d="m21 2-5.46 5.46" />
          <Circle cx="12" cy="11" r="5" />
        </>
      )}
    />
  );
}

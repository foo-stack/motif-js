import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Blinds(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M3 3h18" />
          <Path d="M20 7H8" />
          <Path d="M20 11H8" />
          <Path d="M10 19h10" />
          <Path d="M8 15h12" />
          <Path d="M4 3v14" />
          <Circle cx="4" cy="19" r="2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Microchip(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 12h4" />
          <Path d="M10 17h4" />
          <Path d="M10 7h4" />
          <Path d="M18 12h2" />
          <Path d="M18 18h2" />
          <Path d="M18 6h2" />
          <Path d="M4 12h2" />
          <Path d="M4 18h2" />
          <Path d="M4 6h2" />
          <Rect x="6" y="2" width="12" height="20" rx="2" />
        </>
      )}
    />
  );
}

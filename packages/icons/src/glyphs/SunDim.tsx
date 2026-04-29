import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SunDim(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="4" />
          <Path d="M12 4h.01" />
          <Path d="M20 12h.01" />
          <Path d="M12 20h.01" />
          <Path d="M4 12h.01" />
          <Path d="M17.657 6.343h.01" />
          <Path d="M17.657 17.657h.01" />
          <Path d="M6.343 17.657h.01" />
          <Path d="M6.343 6.343h.01" />
        </>
      )}
    />
  );
}

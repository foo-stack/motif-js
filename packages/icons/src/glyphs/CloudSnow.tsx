import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CloudSnow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <Path d="M8 15h.01" />
          <Path d="M8 19h.01" />
          <Path d="M12 17h.01" />
          <Path d="M12 21h.01" />
          <Path d="M16 15h.01" />
          <Path d="M16 19h.01" />
        </>
      )}
    />
  );
}

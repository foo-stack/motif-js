import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Trees(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
          <Path d="M7 16v6" />
          <Path d="M13 19v3" />
          <Path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5" />
        </>
      )}
    />
  );
}

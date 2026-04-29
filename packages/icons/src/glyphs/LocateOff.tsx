import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LocateOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 19v3" />
          <Path d="M12 2v3" />
          <Path d="M18.89 13.24a7 7 0 0 0-8.13-8.13" />
          <Path d="M19 12h3" />
          <Path d="M2 12h3" />
          <Path d="m2 2 20 20" />
          <Path d="M7.05 7.05a7 7 0 0 0 9.9 9.9" />
        </>
      )}
    />
  );
}

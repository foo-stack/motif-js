import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Waypoints(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m10.586 5.414-5.172 5.172" />
          <Path d="m18.586 13.414-5.172 5.172" />
          <Path d="M6 12h12" />
          <Circle cx="12" cy="20" r="2" />
          <Circle cx="12" cy="4" r="2" />
          <Circle cx="20" cy="12" r="2" />
          <Circle cx="4" cy="12" r="2" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function VolumeOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 9a5 5 0 0 1 .95 2.293" />
          <Path d="M19.364 5.636a9 9 0 0 1 1.889 9.96" />
          <Path d="m2 2 20 20" />
          <Path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11" />
          <Path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686" />
        </>
      )}
    />
  );
}

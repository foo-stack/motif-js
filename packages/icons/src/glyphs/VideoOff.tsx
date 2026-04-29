import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function VideoOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196" />
          <Path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
          <Path d="m2 2 20 20" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CaptionsOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10.5 5H19a2 2 0 0 1 2 2v8.5" />
          <Path d="M17 11h-.5" />
          <Path d="M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" />
          <Path d="m2 2 20 20" />
          <Path d="M7 11h4" />
          <Path d="M7 15h2.5" />
        </>
      )}
    />
  );
}

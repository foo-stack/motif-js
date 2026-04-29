import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PoundSterling(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 7c0-5.333-8-5.333-8 0" />
          <Path d="M10 7v14" />
          <Path d="M6 21h12" />
          <Path d="M6 13h10" />
        </>
      )}
    />
  );
}

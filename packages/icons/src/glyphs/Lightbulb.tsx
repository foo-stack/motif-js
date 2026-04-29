import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Lightbulb(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <Path d="M9 18h6" />
          <Path d="M10 22h4" />
        </>
      )}
    />
  );
}

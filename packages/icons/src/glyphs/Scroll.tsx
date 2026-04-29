import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Scroll(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 17V5a2 2 0 0 0-2-2H4" />
          <Path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
        </>
      )}
    />
  );
}

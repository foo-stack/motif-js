import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Hospital(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 7v4" />
          <Path d="M14 21v-3a2 2 0 0 0-4 0v3" />
          <Path d="M14 9h-4" />
          <Path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
          <Path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
        </>
      )}
    />
  );
}

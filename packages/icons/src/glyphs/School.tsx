import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function School(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M14 21v-3a2 2 0 0 0-4 0v3" />
          <Path d="M18 4.933V21" />
          <Path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" />
          <Path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11" />
          <Path d="M6 4.933V21" />
          <Circle cx="12" cy="9" r="2" />
        </>
      )}
    />
  );
}

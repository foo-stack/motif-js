import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserKey(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M20 11v6" />
          <Path d="M20 13h2" />
          <Path d="M3 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 2.072.578" />
          <Circle cx="10" cy="7" r="4" />
          <Circle cx="20" cy="19" r="2" />
        </>
      )}
    />
  );
}

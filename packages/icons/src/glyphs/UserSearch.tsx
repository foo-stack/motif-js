import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="10" cy="7" r="4" />
          <Path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
          <Circle cx="17" cy="17" r="3" />
          <Path d="m21 21-1.9-1.9" />
        </>
      )}
    />
  );
}

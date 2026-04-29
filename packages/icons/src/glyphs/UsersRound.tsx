import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UsersRound(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M18 21a8 8 0 0 0-16 0" />
          <Circle cx="10" cy="8" r="5" />
          <Path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
        </>
      )}
    />
  );
}

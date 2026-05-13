import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Lasso(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M3.704 14.467a10 8 0 1 1 3.115 2.375" />
          <Path d="M7 22a5 5 0 0 1-2-3.994" />
          <Circle cx="5" cy="16" r="2" />
        </>
      )}
    />
  );
}

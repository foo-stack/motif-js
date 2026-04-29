import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FlagOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
          <Path d="m2 2 20 20" />
          <Path d="M4 22V4" />
          <Path d="M7.656 2H8c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10.347" />
        </>
      )}
    />
  );
}

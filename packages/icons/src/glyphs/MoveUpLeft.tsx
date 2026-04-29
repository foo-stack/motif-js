import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MoveUpLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 11V5H11" />
          <Path d="M5 5L19 19" />
        </>
      )}
    />
  );
}

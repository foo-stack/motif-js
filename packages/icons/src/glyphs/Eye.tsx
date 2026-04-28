import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Eye(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle }) => (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <Circle cx="12" cy="12" r="3" />
        </>
      )}
    />
  );
}

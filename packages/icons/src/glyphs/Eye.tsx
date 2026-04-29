import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Eye(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <Circle cx="12" cy="12" r="3" />
        </>
      )}
    />
  );
}

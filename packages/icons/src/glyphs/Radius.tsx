import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Radius(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M20.34 17.52a10 10 0 1 0-2.82 2.82" />
          <Circle cx="19" cy="19" r="2" />
          <Path d="m13.41 13.41 4.18 4.18" />
          <Circle cx="12" cy="12" r="2" />
        </>
      )}
    />
  );
}

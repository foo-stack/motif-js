import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FlagTriangleLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M18 22V2.8a.8.8 0 0 0-1.17-.71L5.45 7.78a.8.8 0 0 0 0 1.44L18 15.5" />
      )}
    />
  );
}

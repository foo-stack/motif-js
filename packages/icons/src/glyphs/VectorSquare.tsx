import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function VectorSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M19.5 7a24 24 0 0 1 0 10" />
          <Path d="M4.5 7a24 24 0 0 0 0 10" />
          <Path d="M7 19.5a24 24 0 0 0 10 0" />
          <Path d="M7 4.5a24 24 0 0 1 10 0" />
          <Rect x="17" y="17" width="5" height="5" rx="1" />
          <Rect x="17" y="2" width="5" height="5" rx="1" />
          <Rect x="2" y="17" width="5" height="5" rx="1" />
          <Rect x="2" y="2" width="5" height="5" rx="1" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function XSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Path d="m15 9-6 6" />
          <Path d="m9 9 6 6" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LibrarySquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M7 7v10" />
          <Path d="M11 7v10" />
          <Path d="m15 7 2 10" />
        </>
      )}
    />
  );
}

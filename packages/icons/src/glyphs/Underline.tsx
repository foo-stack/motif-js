import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Underline(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Line }) => (
        <>
          <Path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <Line x1="4" y1="21" x2="20" y2="21" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Italic(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line }) => (
        <>
          <Line x1="19" y1="4" x2="10" y2="4" />
          <Line x1="14" y1="20" x2="5" y2="20" />
          <Line x1="15" y1="4" x2="9" y2="20" />
        </>
      )}
    />
  );
}

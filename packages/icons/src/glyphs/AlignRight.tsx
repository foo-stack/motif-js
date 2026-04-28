import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line }) => (
        <>
          <Line x1="21" y1="10" x2="7" y2="10" />
          <Line x1="21" y1="6" x2="3" y2="6" />
          <Line x1="21" y1="14" x2="3" y2="14" />
          <Line x1="21" y1="18" x2="7" y2="18" />
        </>
      )}
    />
  );
}

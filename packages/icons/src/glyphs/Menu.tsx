import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Menu(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line }) => (
        <>
          <Line x1="3" y1="6" x2="21" y2="6" />
          <Line x1="3" y1="12" x2="21" y2="12" />
          <Line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    />
  );
}

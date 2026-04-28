import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Filter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polygon }) => <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />}
    />
  );
}

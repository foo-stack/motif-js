import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Bookmark(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />}
    />
  );
}

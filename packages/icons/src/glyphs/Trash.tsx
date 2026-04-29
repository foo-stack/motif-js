import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Trash(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <Path d="M3 6h18" />
          <Path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </>
      )}
    />
  );
}

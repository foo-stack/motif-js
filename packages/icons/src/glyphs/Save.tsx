import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Save(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline }) => (
        <>
          <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <Polyline points="17 21 17 13 7 13 7 21" />
          <Polyline points="7 3 7 8 15 8" />
        </>
      )}
    />
  );
}

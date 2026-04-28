import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Edit(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polygon }) => (
        <>
          <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <Polygon points="18.5 2.5 21.5 5.5 12 15 9 15 9 12 18.5 2.5" />
        </>
      )}
    />
  );
}

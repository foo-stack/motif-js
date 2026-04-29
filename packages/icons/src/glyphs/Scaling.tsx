import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Scaling(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <Path d="M14 15H9v-5" />
          <Path d="M16 3h5v5" />
          <Path d="M21 3 9 15" />
        </>
      )}
    />
  );
}

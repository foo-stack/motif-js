import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Package2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 3v6" />
          <Path d="M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z" />
          <Path d="M3.054 9.013h17.893" />
        </>
      )}
    />
  );
}

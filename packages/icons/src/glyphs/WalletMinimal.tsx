import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WalletMinimal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 14h.01" />
          <Path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" />
        </>
      )}
    />
  );
}

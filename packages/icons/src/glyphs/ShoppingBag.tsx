import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ShoppingBag(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 10a4 4 0 0 1-8 0" />
          <Path d="M3.103 6.034h17.794" />
          <Path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
        </>
      )}
    />
  );
}

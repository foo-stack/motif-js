import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ShoppingCart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="8" cy="21" r="1" />
          <Circle cx="19" cy="21" r="1" />
          <Path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </>
      )}
    />
  );
}

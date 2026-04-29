import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CreditCard(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="20" height="14" x="2" y="5" rx="2" />
          <Line x1="2" x2="22" y1="10" y2="10" />
        </>
      )}
    />
  );
}

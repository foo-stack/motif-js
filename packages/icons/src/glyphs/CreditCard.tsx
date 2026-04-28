import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CreditCard(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect, Line }) => (
        <>
          <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <Line x1="1" y1="10" x2="23" y2="10" />
        </>
      )}
    />
  );
}

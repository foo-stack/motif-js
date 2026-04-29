import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Dices(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="12" height="12" x="2" y="10" rx="2" ry="2" />
          <Path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" />
          <Path d="M6 18h.01" />
          <Path d="M10 14h.01" />
          <Path d="M15 6h.01" />
          <Path d="M18 9h.01" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Pause(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect x="14" y="3" width="5" height="18" rx="1" />
          <Rect x="5" y="3" width="5" height="18" rx="1" />
        </>
      )}
    />
  );
}

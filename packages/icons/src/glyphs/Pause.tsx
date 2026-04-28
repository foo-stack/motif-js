import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Pause(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect x="6" y="4" width="4" height="16" />
          <Rect x="14" y="4" width="4" height="16" />
        </>
      )}
    />
  );
}

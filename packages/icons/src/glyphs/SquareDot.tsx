import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Circle cx="12" cy="12" r="1" />
        </>
      )}
    />
  );
}

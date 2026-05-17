import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquareDivide(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Line x1="8" x2="16" y1="12" y2="12" />
          <Line x1="12" x2="12" y1="16" y2="16" />
          <Line x1="12" x2="12" y1="8" y2="8" />
        </>
      )}
    />
  );
}

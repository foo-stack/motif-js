import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquarePause(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Line x1="10" x2="10" y1="15" y2="9" />
          <Line x1="14" x2="14" y1="15" y2="9" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquareSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect }) => (
        <>
          <Rect x="3" y="3" width="18" height="18" rx="2" />
          <Rect x="8" y="8" width="8" height="8" rx="1" />
        </>
      )}
    />
  );
}

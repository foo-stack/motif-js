import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquareMenu(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M7 8h10" />
          <Path d="M7 12h10" />
          <Path d="M7 16h10" />
        </>
      )}
    />
  );
}

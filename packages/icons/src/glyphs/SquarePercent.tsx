import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquarePercent(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="m15 9-6 6" />
          <Path d="M9 9h.01" />
          <Path d="M15 15h.01" />
        </>
      )}
    />
  );
}

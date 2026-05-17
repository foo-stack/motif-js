import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function PillBottle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" />
          <Path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
          <Rect width="16" height="5" x="4" y="2" rx="1" />
        </>
      )}
    />
  );
}

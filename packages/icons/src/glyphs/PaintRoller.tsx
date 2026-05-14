import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PaintRoller(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="16" height="6" x="2" y="2" rx="2" />
          <Path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <Rect width="4" height="6" x="8" y="16" rx="1" />
        </>
      )}
    />
  );
}

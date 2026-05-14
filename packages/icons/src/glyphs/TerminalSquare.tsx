import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TerminalSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m7 11 2-2-2-2" />
          <Path d="M11 13h4" />
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        </>
      )}
    />
  );
}

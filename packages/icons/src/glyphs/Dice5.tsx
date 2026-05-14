import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Dice5(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <Path d="M16 8h.01" />
          <Path d="M8 8h.01" />
          <Path d="M8 16h.01" />
          <Path d="M16 16h.01" />
          <Path d="M12 12h.01" />
        </>
      )}
    />
  );
}

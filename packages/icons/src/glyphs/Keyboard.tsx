import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Keyboard(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 8h.01" />
          <Path d="M12 12h.01" />
          <Path d="M14 8h.01" />
          <Path d="M16 12h.01" />
          <Path d="M18 8h.01" />
          <Path d="M6 8h.01" />
          <Path d="M7 16h10" />
          <Path d="M8 12h.01" />
          <Rect width="20" height="16" x="2" y="4" rx="2" />
        </>
      )}
    />
  );
}

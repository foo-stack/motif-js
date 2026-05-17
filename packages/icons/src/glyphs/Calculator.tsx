import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Calculator(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path, Rect }) => (
        <>
          <Rect width="16" height="20" x="4" y="2" rx="2" />
          <Line x1="8" x2="16" y1="6" y2="6" />
          <Line x1="16" x2="16" y1="14" y2="18" />
          <Path d="M16 10h.01" />
          <Path d="M12 10h.01" />
          <Path d="M8 10h.01" />
          <Path d="M12 14h.01" />
          <Path d="M8 14h.01" />
          <Path d="M12 18h.01" />
          <Path d="M8 18h.01" />
        </>
      )}
    />
  );
}

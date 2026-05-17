import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Gamepad(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect }) => (
        <>
          <Line x1="6" x2="10" y1="12" y2="12" />
          <Line x1="8" x2="8" y1="10" y2="14" />
          <Line x1="15" x2="15.01" y1="13" y2="13" />
          <Line x1="18" x2="18.01" y1="11" y2="11" />
          <Rect width="20" height="12" x="2" y="6" rx="2" />
        </>
      )}
    />
  );
}

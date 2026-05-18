import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChartBarStacked(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M11 13v4" />
          <Path d="M15 5v4" />
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Rect x="7" y="13" width="9" height="4" rx="1" />
          <Rect x="7" y="5" width="12" height="4" rx="1" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GanttChartSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M9 8h7" />
          <Path d="M8 12h6" />
          <Path d="M11 16h5" />
        </>
      )}
    />
  );
}

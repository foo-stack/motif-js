import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ChartGantt(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 6h8" />
          <Path d="M12 16h6" />
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="M8 11h7" />
        </>
      )}
    />
  );
}

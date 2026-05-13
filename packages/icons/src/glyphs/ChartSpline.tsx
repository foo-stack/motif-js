import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ChartSpline(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
        </>
      )}
    />
  );
}

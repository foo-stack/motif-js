import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LineChart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="m19 9-5 5-4-4-3 3" />
        </>
      )}
    />
  );
}

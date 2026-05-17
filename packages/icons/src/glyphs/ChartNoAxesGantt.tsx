import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChartNoAxesGantt(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 5h12" />
          <Path d="M4 12h10" />
          <Path d="M12 19h8" />
        </>
      )}
    />
  );
}

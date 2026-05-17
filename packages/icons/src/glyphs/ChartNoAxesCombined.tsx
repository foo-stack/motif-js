import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChartNoAxesCombined(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 16v5" />
          <Path d="M16 14v7" />
          <Path d="M20 10v11" />
          <Path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
          <Path d="M4 18v3" />
          <Path d="M8 14v7" />
        </>
      )}
    />
  );
}

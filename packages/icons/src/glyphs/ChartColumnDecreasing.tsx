import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChartColumnDecreasing(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13 17V9" />
          <Path d="M18 17v-3" />
          <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <Path d="M8 17V5" />
        </>
      )}
    />
  );
}

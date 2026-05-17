import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChartNoAxesColumnDecreasing(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 21V3" />
          <Path d="M12 21V9" />
          <Path d="M19 21v-6" />
        </>
      )}
    />
  );
}

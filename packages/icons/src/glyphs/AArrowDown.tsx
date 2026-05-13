import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14 12 4 4 4-4" />
          <Path d="M18 16V7" />
          <Path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
          <Path d="M3.304 13h6.392" />
        </>
      )}
    />
  );
}

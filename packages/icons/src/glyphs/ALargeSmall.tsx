import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ALargeSmall(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16" />
          <Path d="M15.697 14h5.606" />
          <Path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
          <Path d="M3.304 13h6.392" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Goal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 13V2l8 4-8 4" />
          <Path d="M20.561 10.222a9 9 0 1 1-12.55-5.29" />
          <Path d="M8.002 9.997a5 5 0 1 0 8.9 2.02" />
        </>
      )}
    />
  );
}

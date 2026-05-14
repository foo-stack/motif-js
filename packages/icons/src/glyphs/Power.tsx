import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Power(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v10" />
          <Path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
        </>
      )}
    />
  );
}

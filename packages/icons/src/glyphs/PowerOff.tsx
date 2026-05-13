import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PowerOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
          <Path d="M6.16 6.16a9 9 0 1 0 12.68 12.68" />
          <Path d="M12 2v4" />
          <Path d="m2 2 20 20" />
        </>
      )}
    />
  );
}

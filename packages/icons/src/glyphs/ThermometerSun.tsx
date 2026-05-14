import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ThermometerSun(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v2" />
          <Path d="M12 8a4 4 0 0 0-1.645 7.647" />
          <Path d="M2 12h2" />
          <Path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
          <Path d="m4.93 4.93 1.41 1.41" />
          <Path d="m6.34 17.66-1.41 1.41" />
        </>
      )}
    />
  );
}

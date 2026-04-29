import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LightbulbOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5" />
          <Path d="m2 2 20 20" />
          <Path d="M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5" />
          <Path d="M9 18h6" />
          <Path d="M10 22h4" />
        </>
      )}
    />
  );
}

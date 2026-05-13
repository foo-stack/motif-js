import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Heading5(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 12h8" />
          <Path d="M4 18V6" />
          <Path d="M12 18V6" />
          <Path d="M17 13v-3h4" />
          <Path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17" />
        </>
      )}
    />
  );
}

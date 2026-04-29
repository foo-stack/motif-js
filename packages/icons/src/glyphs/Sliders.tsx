import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Sliders(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 8h4" />
          <Path d="M12 21v-9" />
          <Path d="M12 8V3" />
          <Path d="M17 16h4" />
          <Path d="M19 12V3" />
          <Path d="M19 21v-5" />
          <Path d="M3 14h4" />
          <Path d="M5 10V3" />
          <Path d="M5 21v-7" />
        </>
      )}
    />
  );
}

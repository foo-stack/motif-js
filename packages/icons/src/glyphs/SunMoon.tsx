import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SunMoon(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v2" />
          <Path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715" />
          <Path d="M16 12a4 4 0 0 0-4-4" />
          <Path d="m19 5-1.256 1.256" />
          <Path d="M20 12h2" />
        </>
      )}
    />
  );
}

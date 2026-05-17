import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FlipHorizontal2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m3 7 5 5-5 5V7" />
          <Path d="m21 7-5 5 5 5V7" />
          <Path d="M12 20v2" />
          <Path d="M12 14v2" />
          <Path d="M12 8v2" />
          <Path d="M12 2v2" />
        </>
      )}
    />
  );
}

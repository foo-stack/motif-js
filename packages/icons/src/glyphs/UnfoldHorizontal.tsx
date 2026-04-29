import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UnfoldHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 12h6" />
          <Path d="M8 12H2" />
          <Path d="M12 2v2" />
          <Path d="M12 8v2" />
          <Path d="M12 14v2" />
          <Path d="M12 20v2" />
          <Path d="m19 15 3-3-3-3" />
          <Path d="m5 9-3 3 3 3" />
        </>
      )}
    />
  );
}

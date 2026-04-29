import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Heading4(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 18V6" />
          <Path d="M17 10v3a1 1 0 0 0 1 1h3" />
          <Path d="M21 10v8" />
          <Path d="M4 12h8" />
          <Path d="M4 18V6" />
        </>
      )}
    />
  );
}

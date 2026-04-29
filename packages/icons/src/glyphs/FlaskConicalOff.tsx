import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FlaskConicalOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 2v2.343" />
          <Path d="M14 2v6.343" />
          <Path d="m2 2 20 20" />
          <Path d="M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-1.755-2.96l5.227-9.563" />
          <Path d="M6.453 15H15" />
          <Path d="M8.5 2h7" />
        </>
      )}
    />
  );
}

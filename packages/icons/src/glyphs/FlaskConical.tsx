import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FlaskConical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
          <Path d="M6.453 15h11.094" />
          <Path d="M8.5 2h7" />
        </>
      )}
    />
  );
}

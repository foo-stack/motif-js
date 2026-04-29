import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Terminal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 19h8" />
          <Path d="m4 17 6-6-6-6" />
        </>
      )}
    />
  );
}

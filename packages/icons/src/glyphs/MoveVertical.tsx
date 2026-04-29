import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MoveVertical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v20" />
          <Path d="m8 18 4 4 4-4" />
          <Path d="m8 6 4-4 4 4" />
        </>
      )}
    />
  );
}

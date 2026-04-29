import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowDownRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m7 7 10 10" />
          <Path d="M17 7v10H7" />
        </>
      )}
    />
  );
}

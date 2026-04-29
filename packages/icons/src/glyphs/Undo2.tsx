import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Undo2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M9 14 4 9l5-5" />
          <Path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
        </>
      )}
    />
  );
}

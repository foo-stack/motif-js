import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Redo2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 14 5-5-5-5" />
          <Path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" />
        </>
      )}
    />
  );
}

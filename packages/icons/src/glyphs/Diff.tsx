import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Diff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 3v14" />
          <Path d="M5 10h14" />
          <Path d="M5 21h14" />
        </>
      )}
    />
  );
}

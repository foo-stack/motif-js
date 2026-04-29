import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Pill(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <Path d="m8.5 8.5 7 7" />
        </>
      )}
    />
  );
}

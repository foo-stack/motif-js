import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BookCopy(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 7a2 2 0 0 0-2 2v11" />
          <Path d="M5.803 18H5a2 2 0 0 0 0 4h9.5a.5.5 0 0 0 .5-.5V21" />
          <Path d="M9 15V4a2 2 0 0 1 2-2h9.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H11a2 2 0 0 1 0-4h10" />
        </>
      )}
    />
  );
}

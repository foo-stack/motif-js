import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Refrigerator(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z" />
          <Path d="M5 10h14" />
          <Path d="M15 7v6" />
        </>
      )}
    />
  );
}

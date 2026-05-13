import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CornerDownRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 10 5 5-5 5" />
          <Path d="M4 4v7a4 4 0 0 0 4 4h12" />
        </>
      )}
    />
  );
}

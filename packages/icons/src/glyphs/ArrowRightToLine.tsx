import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowRightToLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 12H3" />
          <Path d="m11 18 6-6-6-6" />
          <Path d="M21 5v14" />
        </>
      )}
    />
  );
}

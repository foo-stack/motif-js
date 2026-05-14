import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowsUpFromLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m4 6 3-3 3 3" />
          <Path d="M7 17V3" />
          <Path d="m14 6 3-3 3 3" />
          <Path d="M17 17V3" />
          <Path d="M4 21h16" />
        </>
      )}
    />
  );
}

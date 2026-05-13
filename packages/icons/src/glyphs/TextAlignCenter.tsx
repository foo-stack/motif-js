import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TextAlignCenter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 5H3" />
          <Path d="M17 12H7" />
          <Path d="M19 19H5" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlignRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 5H3" />
          <Path d="M21 12H9" />
          <Path d="M21 19H7" />
        </>
      )}
    />
  );
}

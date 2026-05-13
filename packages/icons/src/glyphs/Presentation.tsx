import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Presentation(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 3h20" />
          <Path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <Path d="m7 21 5-5 5 5" />
        </>
      )}
    />
  );
}

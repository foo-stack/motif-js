import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Milestone(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 13v8" />
          <Path d="M12 3v3" />
          <Path d="M18.172 6a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
        </>
      )}
    />
  );
}

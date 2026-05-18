import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Merge(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m8 6 4-4 4 4" />
          <Path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
          <Path d="m20 22-5-5" />
        </>
      )}
    />
  );
}

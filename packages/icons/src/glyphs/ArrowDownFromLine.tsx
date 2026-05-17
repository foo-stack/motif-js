import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowDownFromLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 3H5" />
          <Path d="M12 21V7" />
          <Path d="m6 15 6 6 6-6" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowUpLeftFromCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 8V2h6" />
          <Path d="m2 2 10 10" />
          <Path d="M12 2A10 10 0 1 1 2 12" />
        </>
      )}
    />
  );
}

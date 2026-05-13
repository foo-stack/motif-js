import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowUpFromLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m18 9-6-6-6 6" />
          <Path d="M12 3v14" />
          <Path d="M5 21h14" />
        </>
      )}
    />
  );
}

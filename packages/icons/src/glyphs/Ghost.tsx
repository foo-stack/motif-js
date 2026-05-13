import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Ghost(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M9 10h.01" />
          <Path d="M15 10h.01" />
          <Path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Factory(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 16h.01" />
          <Path d="M16 16h.01" />
          <Path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
          <Path d="M8 16h.01" />
        </>
      )}
    />
  );
}

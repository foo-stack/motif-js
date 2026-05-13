import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Share(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v13" />
          <Path d="m16 6-4-4-4 4" />
          <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        </>
      )}
    />
  );
}

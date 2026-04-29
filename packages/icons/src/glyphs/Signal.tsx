import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Signal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 20h.01" />
          <Path d="M7 20v-4" />
          <Path d="M12 20v-8" />
          <Path d="M17 20V8" />
          <Path d="M22 4v16" />
        </>
      )}
    />
  );
}

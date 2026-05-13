import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RepeatOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11.656 6H21l-4-4" />
          <Path d="M17.898 17.898A4 4 0 0 1 17 18H3l4-4" />
          <Path d="m2 2 20 20" />
          <Path d="M21 13v1a4 4 0 0 1-.171 1.159" />
          <Path d="m21 6-4 4" />
          <Path d="M3 11v-1a4 4 0 0 1 3.102-3.898" />
          <Path d="m7 22-4-4" />
        </>
      )}
    />
  );
}

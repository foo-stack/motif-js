import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MessageSquareDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14 3h2" />
          <Path d="M16 19h-2" />
          <Path d="M2 12v-2" />
          <Path d="M2 16v5.286a.71.71 0 0 0 1.212.502l1.149-1.149" />
          <Path d="M20 19a2 2 0 0 0 2-2v-1" />
          <Path d="M22 10v2" />
          <Path d="M22 6V5a2 2 0 0 0-2-2" />
          <Path d="M4 3a2 2 0 0 0-2 2v1" />
          <Path d="M8 19h2" />
          <Path d="M8 3h2" />
        </>
      )}
    />
  );
}

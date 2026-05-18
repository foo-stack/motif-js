import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CookingPot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 12h20" />
          <Path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
          <Path d="m4 8 16-4" />
          <Path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
        </>
      )}
    />
  );
}

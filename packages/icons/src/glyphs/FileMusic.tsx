import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function FileMusic(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M11.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v10.35" />
          <Path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <Path d="M8 20v-7l3 1.474" />
          <Circle cx="6" cy="20" r="2" />
        </>
      )}
    />
  );
}

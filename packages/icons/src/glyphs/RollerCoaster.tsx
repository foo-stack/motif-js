import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function RollerCoaster(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 19V5" />
          <Path d="M10 19V6.8" />
          <Path d="M14 19v-7.8" />
          <Path d="M18 5v4" />
          <Path d="M18 19v-6" />
          <Path d="M22 19V9" />
          <Path d="M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65" />
        </>
      )}
    />
  );
}

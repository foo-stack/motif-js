import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CirclePoundSterling(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M10 16V9.5a1 1 0 0 1 5 0" />
          <Path d="M8 12h4" />
          <Path d="M8 16h7" />
        </>
      )}
    />
  );
}

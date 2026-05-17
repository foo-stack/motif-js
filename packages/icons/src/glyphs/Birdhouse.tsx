import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Birdhouse(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 18v4" />
          <Path d="m17 18 1.956-11.468" />
          <Path d="m3 8 7.82-5.615a2 2 0 0 1 2.36 0L21 8" />
          <Path d="M4 18h16" />
          <Path d="M7 18 5.044 6.532" />
          <Circle cx="12" cy="10" r="2" />
        </>
      )}
    />
  );
}

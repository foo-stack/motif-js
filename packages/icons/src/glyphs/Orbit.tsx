import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Orbit(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" />
          <Path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" />
          <Circle cx="12" cy="12" r="3" />
          <Circle cx="19" cy="5" r="2" />
          <Circle cx="5" cy="19" r="2" />
        </>
      )}
    />
  );
}

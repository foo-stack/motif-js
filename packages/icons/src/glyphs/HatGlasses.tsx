import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HatGlasses(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M14 18a2 2 0 0 0-4 0" />
          <Path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11" />
          <Path d="M2 11h20" />
          <Circle cx="17" cy="18" r="3" />
          <Circle cx="7" cy="18" r="3" />
        </>
      )}
    />
  );
}

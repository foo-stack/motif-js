import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FishingRod(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M4 11h1" />
          <Path d="M8 15a2 2 0 0 1-4 0V3a1 1 0 0 1 1-1h.5C14 2 20 9 20 18v4" />
          <Circle cx="18" cy="18" r="2" />
        </>
      )}
    />
  );
}

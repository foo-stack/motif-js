import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function WavesLadder(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 5a2 2 0 0 0-2 2v11" />
          <Path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <Path d="M7 13h10" />
          <Path d="M7 9h10" />
          <Path d="M9 5a2 2 0 0 0-2 2v11" />
        </>
      )}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Backpack(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <Path d="M8 10h8" />
          <Path d="M8 18h8" />
          <Path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
          <Path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </>
      )}
    />
  );
}

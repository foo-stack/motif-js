import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquaresSubtract(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 22a2 2 0 0 1-2-2" />
          <Path d="M16 22h-2" />
          <Path d="M16 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-5a2 2 0 0 1 2-2h5a1 1 0 0 0 1-1z" />
          <Path d="M20 8a2 2 0 0 1 2 2" />
          <Path d="M22 14v2" />
          <Path d="M22 20a2 2 0 0 1-2 2" />
        </>
      )}
    />
  );
}

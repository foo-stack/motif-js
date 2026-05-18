import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SquaresIntersect(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 22a2 2 0 0 1-2-2" />
          <Path d="M14 2a2 2 0 0 1 2 2" />
          <Path d="M16 22h-2" />
          <Path d="M2 10V8" />
          <Path d="M2 4a2 2 0 0 1 2-2" />
          <Path d="M20 8a2 2 0 0 1 2 2" />
          <Path d="M22 14v2" />
          <Path d="M22 20a2 2 0 0 1-2 2" />
          <Path d="M4 16a2 2 0 0 1-2-2" />
          <Path d="M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z" />
          <Path d="M8 2h2" />
        </>
      )}
    />
  );
}

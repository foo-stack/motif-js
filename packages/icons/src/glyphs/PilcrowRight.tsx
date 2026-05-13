import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PilcrowRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 3v11" />
          <Path d="M10 9H7a1 1 0 0 1 0-6h8" />
          <Path d="M14 3v11" />
          <Path d="m18 14 4 4H2" />
          <Path d="m22 18-4 4" />
        </>
      )}
    />
  );
}

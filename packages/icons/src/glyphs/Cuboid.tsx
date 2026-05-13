import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Cuboid(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 22v-8" />
          <Path d="M2.336 8.89 10 14l11.715-7.029" />
          <Path d="M22 14a2 2 0 0 1-.971 1.715l-10 6a2 2 0 0 1-2.138-.05l-6-4A2 2 0 0 1 2 16v-6a2 2 0 0 1 .971-1.715l10-6a2 2 0 0 1 2.138.05l6 4A2 2 0 0 1 22 8z" />
        </>
      )}
    />
  );
}

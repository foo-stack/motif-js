import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PilcrowLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14 3v11" />
          <Path d="M14 9h-3a3 3 0 0 1 0-6h9" />
          <Path d="M18 3v11" />
          <Path d="M22 18H2l4-4" />
          <Path d="m6 22-4-4" />
        </>
      )}
    />
  );
}

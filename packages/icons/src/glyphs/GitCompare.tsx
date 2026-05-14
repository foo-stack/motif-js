import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GitCompare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="18" cy="18" r="3" />
          <Circle cx="6" cy="6" r="3" />
          <Path d="M13 6h3a2 2 0 0 1 2 2v7" />
          <Path d="M11 18H8a2 2 0 0 1-2-2V9" />
        </>
      )}
    />
  );
}

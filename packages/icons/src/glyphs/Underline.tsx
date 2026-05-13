import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Underline(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M6 4v6a6 6 0 0 0 12 0V4" />
          <Line x1="4" x2="20" y1="20" y2="20" />
        </>
      )}
    />
  );
}

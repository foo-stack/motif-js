import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Strikethrough(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Path }) => (
        <>
          <Path d="M16 4H9a3 3 0 0 0-2.83 4" />
          <Path d="M14 12a4 4 0 0 1 0 8H6" />
          <Line x1="4" x2="20" y1="12" y2="12" />
        </>
      )}
    />
  );
}

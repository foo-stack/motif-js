import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ImageMinus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line, Path }) => (
        <>
          <Path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
          <Line x1="16" x2="22" y1="5" y2="5" />
          <Circle cx="9" cy="9" r="2" />
          <Path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </>
      )}
    />
  );
}

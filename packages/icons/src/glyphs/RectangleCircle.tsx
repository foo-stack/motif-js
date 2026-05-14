import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RectangleCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M14 4v16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <Circle cx="14" cy="12" r="8" />
        </>
      )}
    />
  );
}

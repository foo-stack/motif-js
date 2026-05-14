import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LineDotRightHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M 3 12 L 15 12" />
          <Circle cx="18" cy="12" r="3" />
        </>
      )}
    />
  );
}

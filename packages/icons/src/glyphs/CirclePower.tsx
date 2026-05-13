import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CirclePower(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 7v4" />
          <Path d="M7.998 9.003a5 5 0 1 0 8-.005" />
        </>
      )}
    />
  );
}

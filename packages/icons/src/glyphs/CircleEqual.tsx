import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleEqual(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M7 10h10" />
          <Path d="M7 14h10" />
        </>
      )}
    />
  );
}

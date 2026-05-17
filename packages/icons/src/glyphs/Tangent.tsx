import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Tangent(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="17" cy="4" r="2" />
          <Path d="M15.59 5.41 5.41 15.59" />
          <Circle cx="4" cy="17" r="2" />
          <Path d="M12 22s-4-9-1.5-11.5S22 12 22 12" />
        </>
      )}
    />
  );
}

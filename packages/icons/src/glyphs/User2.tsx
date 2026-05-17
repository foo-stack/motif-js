import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function User2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="8" r="5" />
          <Path d="M20 21a8 8 0 0 0-16 0" />
        </>
      )}
    />
  );
}

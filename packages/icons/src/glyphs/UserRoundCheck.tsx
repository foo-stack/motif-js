import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function UserRoundCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M2 21a8 8 0 0 1 13.292-6" />
          <Circle cx="10" cy="8" r="5" />
          <Path d="m16 19 2 2 4-4" />
        </>
      )}
    />
  );
}

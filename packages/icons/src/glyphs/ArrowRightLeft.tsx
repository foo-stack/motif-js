import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowRightLeft(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m16 3 4 4-4 4" />
          <Path d="M20 7H4" />
          <Path d="m8 21-4-4 4-4" />
          <Path d="M4 17h16" />
        </>
      )}
    />
  );
}

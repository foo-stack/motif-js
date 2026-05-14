import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Sword(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m11 19-6-6" />
          <Path d="m5 21-2-2" />
          <Path d="m8 16-4 4" />
          <Path d="M9.5 17.5 21 6V3h-3L6.5 14.5" />
        </>
      )}
    />
  );
}

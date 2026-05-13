import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Egg(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" />}
    />
  );
}

import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Squircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />}
    />
  );
}
